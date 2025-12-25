// Client-side configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const VIEWER_CONFIG = {
    env: 'AutodeskProduction',
    api: 'derivativeV2'
};

// Custom property names used for 4D/5D/6D
export const CUSTOM_PROPERTIES = {
    // 4D - Schedule
    PLANNED_START: 'PlannedStart',
    PLANNED_FINISH: 'PlannedFinish',
    CONSTRUCTION_STATUS: 'ConstructionStatus',
    PHASE: 'Phase',

    // 5D - Cost
    UNIT_COST: 'UnitCost',
    TOTAL_COST: 'TotalCost',
    COST_CODE: 'CostCode',
    SUPPLIER: 'Supplier',

    // 6D - Sustainability
    EMBODIED_CARBON: 'EmbodiedCarbon',
    ENERGY_PERFORMANCE: 'EnergyPerformance',
    RECYCLABLE_CONTENT: 'RecyclableContent',
    PRODUCT_CERT: 'ProductCertification'
};

// Status options for construction status
export const CONSTRUCTION_STATUS_OPTIONS = [
    { value: 'not_started', label: 'Not Started', color: '#6b7280' },
    { value: 'in_progress', label: 'In Progress', color: '#f59e0b' },
    { value: 'completed', label: 'Completed', color: '#10b981' },
    { value: 'delayed', label: 'Delayed', color: '#ef4444' }
];
