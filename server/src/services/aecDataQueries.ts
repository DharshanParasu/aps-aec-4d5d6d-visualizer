// AEC Data Model GraphQL Queries and Mutations
// These are reusable queries for reading and writing data

// Query to get element properties from AEC Data Model
export const GET_ELEMENT_PROPERTIES = `
  query GetElementProperties($projectId: ID!, $elementId: ID!) {
    aecElementProperties(projectId: $projectId, elementId: $elementId) {
      id
      name
      category
      properties {
        name
        value
        displayValue
        type
        group
      }
      customProperties {
        name
        value
        type
      }
    }
  }
`;

// Query to get elements by category
export const GET_ELEMENTS_BY_CATEGORY = `
  query GetElementsByCategory($projectId: ID!, $modelId: ID!, $category: String!) {
    aecElements(projectId: $projectId, modelId: $modelId, filter: { category: $category }) {
      results {
        id
        name
        category
        externalId
        properties {
          name
          value
        }
      }
      pagination {
        cursor
        hasMore
      }
    }
  }
`;

// Query to get quantities for cost calculation
export const GET_ELEMENT_QUANTITIES = `
  query GetElementQuantities($projectId: ID!, $elementIds: [ID!]!) {
    aecElementQuantities(projectId: $projectId, elementIds: $elementIds) {
      elementId
      quantities {
        name
        value
        unit
      }
    }
  }
`;

// Mutation to create or update custom properties
export const UPDATE_CUSTOM_PROPERTY = `
  mutation UpdateCustomProperty($projectId: ID!, $elementId: ID!, $propertyName: String!, $propertyValue: String!, $propertyType: String!) {
    updateAecElementProperty(
      input: {
        projectId: $projectId
        elementId: $elementId
        property: {
          name: $propertyName
          value: $propertyValue
          type: $propertyType
        }
      }
    ) {
      success
      element {
        id
        customProperties {
          name
          value
        }
      }
    }
  }
`;

// Mutation to batch update multiple properties
export const BATCH_UPDATE_PROPERTIES = `
  mutation BatchUpdateProperties($projectId: ID!, $updates: [PropertyUpdateInput!]!) {
    batchUpdateAecElementProperties(
      input: {
        projectId: $projectId
        updates: $updates
      }
    ) {
      success
      results {
        elementId
        success
        error
      }
    }
  }
`;

// Query for schedule data (4D)
export const GET_SCHEDULE_PROPERTIES = `
  query GetScheduleProperties($projectId: ID!, $modelId: ID!) {
    aecElements(projectId: $projectId, modelId: $modelId) {
      results {
        id
        externalId
        customProperties {
          name
          value
        }
      }
    }
  }
`;

// Query for sustainability data (6D)
export const GET_SUSTAINABILITY_DATA = `
  query GetSustainabilityData($projectId: ID!, $elementIds: [ID!]!) {
    aecElementProperties(projectId: $projectId, elementIds: $elementIds) {
      id
      customProperties {
        name
        value
      }
      properties {
        name
        value
        group
      }
    }
  }
`;
