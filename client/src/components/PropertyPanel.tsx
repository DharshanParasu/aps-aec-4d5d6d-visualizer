'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { API_BASE_URL, CUSTOM_PROPERTIES, CONSTRUCTION_STATUS_OPTIONS } from '@/config';

interface PropertyPanelProps {
    selectedDbIds: number[];
}

interface ElementProperty {
    name: string;
    value: string;
    displayValue?: string;
    group?: string;
    isCustom?: boolean;
}

export default function PropertyPanel({ selectedDbIds }: PropertyPanelProps) {
    const { viewMode, currentProject } = useApp();
    const [properties, setProperties] = useState<ElementProperty[]>([]);
    const [customProps, setCustomProps] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'properties' | 'edit'>('properties');

    // Fetch element properties
    useEffect(() => {
        if (selectedDbIds.length === 0) {
            setProperties([]);
            return;
        }

        // In a real implementation, we would fetch from AEC Data Model
        // For now, showing placeholder data structure
        setProperties([
            { name: 'Element ID', value: selectedDbIds[0].toString(), group: 'Identity' },
            { name: 'Category', value: 'Walls', group: 'Identity' },
            { name: 'Family', value: 'Basic Wall', group: 'Identity' },
            { name: 'Type', value: 'Generic - 200mm', group: 'Identity' },
            { name: 'Area', value: '25.5 m²', group: 'Dimensions' },
            { name: 'Volume', value: '5.1 m³', group: 'Dimensions' },
            { name: 'Length', value: '10.2 m', group: 'Dimensions' },
        ]);

        // Fetch custom properties that we've set
        setCustomProps({
            [CUSTOM_PROPERTIES.PLANNED_START]: '',
            [CUSTOM_PROPERTIES.PLANNED_FINISH]: '',
            [CUSTOM_PROPERTIES.CONSTRUCTION_STATUS]: 'not_started',
            [CUSTOM_PROPERTIES.UNIT_COST]: '',
            [CUSTOM_PROPERTIES.EMBODIED_CARBON]: '',
        });
    }, [selectedDbIds]);

    const handleSaveCustomProperties = async () => {
        if (!currentProject || selectedDbIds.length === 0) return;

        setSaving(true);
        try {
            // Send mutation to update custom properties
            const response = await fetch(`${API_BASE_URL}/api/graphql`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: `
            mutation UpdateCustomProperty($projectId: ID!, $elementId: ID!, $properties: [PropertyInput!]!) {
              updateElementProperties(projectId: $projectId, elementId: $elementId, properties: $properties) {
                success
              }
            }
          `,
                    variables: {
                        projectId: currentProject,
                        elementId: selectedDbIds[0].toString(),
                        properties: Object.entries(customProps).map(([name, value]) => ({
                            name,
                            value,
                            type: 'string'
                        }))
                    }
                })
            });

            if (response.ok) {
                // Show success feedback
                alert('Properties saved successfully!');
            }
        } catch (error) {
            console.error('Error saving properties:', error);
            alert('Failed to save properties');
        }
        setSaving(false);
    };

    if (selectedDbIds.length === 0) {
        return (
            <div className="h-full flex items-center justify-center text-gray-400 p-4 text-center">
                <div>
                    <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                    </svg>
                    <p>Select an element to view properties</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-gray-800/50 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-gray-700">
                <h3 className="text-lg font-semibold text-white">Element Properties</h3>
                <p className="text-sm text-gray-400">{selectedDbIds.length} element(s) selected</p>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-700">
                <button
                    onClick={() => setActiveTab('properties')}
                    className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'properties'
                            ? 'text-blue-400 border-b-2 border-blue-400'
                            : 'text-gray-400 hover:text-gray-300'
                        }`}
                >
                    Properties
                </button>
                <button
                    onClick={() => setActiveTab('edit')}
                    className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'edit'
                            ? 'text-blue-400 border-b-2 border-blue-400'
                            : 'text-gray-400 hover:text-gray-300'
                        }`}
                >
                    Edit Custom
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                {activeTab === 'properties' ? (
                    <div className="space-y-4">
                        {/* Group properties by group */}
                        {['Identity', 'Dimensions'].map(group => (
                            <div key={group}>
                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{group}</h4>
                                <div className="space-y-1">
                                    {properties.filter(p => p.group === group).map(prop => (
                                        <div key={prop.name} className="flex justify-between py-1 text-sm">
                                            <span className="text-gray-400">{prop.name}</span>
                                            <span className="text-gray-200">{prop.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* 4D Properties */}
                        <div>
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Schedule (4D)</h4>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Planned Start</label>
                                    <input
                                        type="date"
                                        value={customProps[CUSTOM_PROPERTIES.PLANNED_START] || ''}
                                        onChange={(e) => setCustomProps(prev => ({ ...prev, [CUSTOM_PROPERTIES.PLANNED_START]: e.target.value }))}
                                        className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-blue-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Planned Finish</label>
                                    <input
                                        type="date"
                                        value={customProps[CUSTOM_PROPERTIES.PLANNED_FINISH] || ''}
                                        onChange={(e) => setCustomProps(prev => ({ ...prev, [CUSTOM_PROPERTIES.PLANNED_FINISH]: e.target.value }))}
                                        className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-blue-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Status</label>
                                    <select
                                        value={customProps[CUSTOM_PROPERTIES.CONSTRUCTION_STATUS] || 'not_started'}
                                        onChange={(e) => setCustomProps(prev => ({ ...prev, [CUSTOM_PROPERTIES.CONSTRUCTION_STATUS]: e.target.value }))}
                                        className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-blue-500 focus:outline-none"
                                    >
                                        {CONSTRUCTION_STATUS_OPTIONS.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* 5D Properties */}
                        <div>
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Cost (5D)</h4>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Unit Cost ($)</label>
                                    <input
                                        type="number"
                                        value={customProps[CUSTOM_PROPERTIES.UNIT_COST] || ''}
                                        onChange={(e) => setCustomProps(prev => ({ ...prev, [CUSTOM_PROPERTIES.UNIT_COST]: e.target.value }))}
                                        className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-blue-500 focus:outline-none"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 6D Properties */}
                        <div>
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Sustainability (6D)</h4>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Embodied Carbon (kgCO₂e)</label>
                                    <input
                                        type="number"
                                        value={customProps[CUSTOM_PROPERTIES.EMBODIED_CARBON] || ''}
                                        onChange={(e) => setCustomProps(prev => ({ ...prev, [CUSTOM_PROPERTIES.EMBODIED_CARBON]: e.target.value }))}
                                        className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-blue-500 focus:outline-none"
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleSaveCustomProperties}
                            disabled={saving}
                            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            {saving ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                'Save Properties'
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
