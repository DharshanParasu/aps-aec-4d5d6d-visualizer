import fetch from 'node-fetch';
import {
    GET_ELEMENT_PROPERTIES,
    GET_ELEMENTS_BY_CATEGORY,
    GET_ELEMENT_QUANTITIES,
    UPDATE_CUSTOM_PROPERTY,
    BATCH_UPDATE_PROPERTIES,
    GET_SCHEDULE_PROPERTIES,
    GET_SUSTAINABILITY_DATA
} from './aecDataQueries';

const AEC_DM_GRAPHQL_URL = process.env.AEC_DM_GRAPHQL_URL || 'https://developer.api.autodesk.com/aec/graphql';

interface GraphQLResponse<T> {
    data?: T;
    errors?: Array<{ message: string }>;
}

export class AECDataService {
    private accessToken: string;

    constructor(accessToken: string) {
        this.accessToken = accessToken;
    }

    private async executeQuery<T>(query: string, variables: Record<string, any>): Promise<T> {
        const response = await fetch(AEC_DM_GRAPHQL_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.accessToken}`
            },
            body: JSON.stringify({ query, variables })
        });

        const result = await response.json() as GraphQLResponse<T>;

        if (result.errors && result.errors.length > 0) {
            throw new Error(result.errors.map(e => e.message).join(', '));
        }

        return result.data as T;
    }

    // Get properties for a single element
    async getElementProperties(projectId: string, elementId: string) {
        return this.executeQuery(GET_ELEMENT_PROPERTIES, { projectId, elementId });
    }

    // Get elements filtered by category
    async getElementsByCategory(projectId: string, modelId: string, category: string) {
        return this.executeQuery(GET_ELEMENTS_BY_CATEGORY, { projectId, modelId, category });
    }

    // Get quantities for cost calculations
    async getElementQuantities(projectId: string, elementIds: string[]) {
        return this.executeQuery(GET_ELEMENT_QUANTITIES, { projectId, elementIds });
    }

    // Update a custom property on an element
    async updateCustomProperty(
        projectId: string,
        elementId: string,
        propertyName: string,
        propertyValue: string,
        propertyType: string = 'string'
    ) {
        return this.executeQuery(UPDATE_CUSTOM_PROPERTY, {
            projectId,
            elementId,
            propertyName,
            propertyValue,
            propertyType
        });
    }

    // Batch update multiple properties
    async batchUpdateProperties(
        projectId: string,
        updates: Array<{ elementId: string; properties: Array<{ name: string; value: string; type?: string }> }>
    ) {
        return this.executeQuery(BATCH_UPDATE_PROPERTIES, { projectId, updates });
    }

    // Get schedule-related properties for 4D view
    async getScheduleProperties(projectId: string, modelId: string) {
        return this.executeQuery(GET_SCHEDULE_PROPERTIES, { projectId, modelId });
    }

    // Get sustainability data for 6D view
    async getSustainabilityData(projectId: string, elementIds: string[]) {
        return this.executeQuery(GET_SUSTAINABILITY_DATA, { projectId, elementIds });
    }
}

export default AECDataService;
