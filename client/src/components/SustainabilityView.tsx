'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';

interface SustainabilityMetric {
    category: string;
    embodiedCarbon: number; // kgCO2e
    recyclableContent: number; // percentage
    energyPerformance: string;
    certification: string;
    color: string;
}

export default function SustainabilityView() {
    const { currentProject } = useApp();
    const [metrics, setMetrics] = useState<SustainabilityMetric[]>([]);
    const [targets] = useState({
        totalCarbon: 500000, // kgCO2e target
        recyclableContent: 30, // % target
    });

    // Mock data for demonstration
    useEffect(() => {
        setMetrics([
            { category: 'Concrete', embodiedCarbon: 182000, recyclableContent: 15, energyPerformance: 'B', certification: 'EPD', color: '#6b7280' },
            { category: 'Steel', embodiedCarbon: 95000, recyclableContent: 85, energyPerformance: 'A', certification: 'EPD', color: '#3b82f6' },
            { category: 'Glass', embodiedCarbon: 28000, recyclableContent: 40, energyPerformance: 'A+', certification: 'Cradle2Cradle', color: '#06b6d4' },
            { category: 'Timber', embodiedCarbon: -12000, recyclableContent: 95, energyPerformance: 'A+', certification: 'FSC', color: '#84cc16' },
            { category: 'Insulation', embodiedCarbon: 18000, recyclableContent: 60, energyPerformance: 'A', certification: 'EPD', color: '#f59e0b' },
            { category: 'Finishes', embodiedCarbon: 45000, recyclableContent: 25, energyPerformance: 'B', certification: 'Low VOC', color: '#ec4899' },
        ]);
    }, [currentProject]);

    const totalCarbon = metrics.reduce((sum, m) => sum + m.embodiedCarbon, 0);
    const avgRecyclable = metrics.reduce((sum, m) => sum + m.recyclableContent, 0) / metrics.length;
    const carbonProgress = (totalCarbon / targets.totalCarbon) * 100;

    const formatCarbon = (value: number) => {
        if (Math.abs(value) >= 1000) {
            return `${(value / 1000).toFixed(1)}t CO₂e`;
        }
        return `${value.toLocaleString()} kg CO₂e`;
    };

    const getPerformanceColor = (grade: string) => {
        const colors: Record<string, string> = {
            'A+': '#10b981',
            'A': '#22c55e',
            'B': '#84cc16',
            'C': '#eab308',
            'D': '#f97316',
            'E': '#ef4444'
        };
        return colors[grade] || '#6b7280';
    };

    return (
        <div className="h-full flex flex-col bg-gray-800/50 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">6D Sustainability Analysis</h3>

                {/* Key metrics */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30 rounded-lg p-3">
                        <div className="text-xs text-green-400 mb-1">Total Embodied Carbon</div>
                        <div className="text-xl font-bold text-white">{formatCarbon(totalCarbon)}</div>
                        <div className="text-xs text-gray-400 mt-1">Target: {formatCarbon(targets.totalCarbon)}</div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 rounded-lg p-3">
                        <div className="text-xs text-blue-400 mb-1">Avg Recyclable Content</div>
                        <div className="text-xl font-bold text-white">{avgRecyclable.toFixed(1)}%</div>
                        <div className="text-xs text-gray-400 mt-1">Target: {targets.recyclableContent}%</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30 rounded-lg p-3">
                        <div className="text-xs text-purple-400 mb-1">Carbon Offset Potential</div>
                        <div className="text-xl font-bold text-white">
                            {metrics.filter(m => m.embodiedCarbon < 0).length > 0 ?
                                formatCarbon(Math.abs(metrics.filter(m => m.embodiedCarbon < 0).reduce((s, m) => s + m.embodiedCarbon, 0))) :
                                '0 kg CO₂e'
                            }
                        </div>
                        <div className="text-xs text-gray-400 mt-1">From bio-based materials</div>
                    </div>
                </div>

                {/* Carbon target progress */}
                <div>
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>Carbon Target Progress</span>
                        <span className={carbonProgress <= 100 ? 'text-green-400' : 'text-red-400'}>
                            {carbonProgress.toFixed(1)}% of target
                        </span>
                    </div>
                    <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
                        <div
                            className={`h-full transition-all duration-500 ${carbonProgress <= 100 ? 'bg-gradient-to-r from-green-500 to-green-400' : 'bg-gradient-to-r from-red-500 to-red-400'}`}
                            style={{ width: `${Math.min(carbonProgress, 100)}%` }}
                        />
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                    {/* Carbon by category chart */}
                    <div>
                        <h4 className="text-sm font-medium text-gray-300 mb-3">Embodied Carbon by Category</h4>
                        <div className="space-y-2">
                            {[...metrics].sort((a, b) => b.embodiedCarbon - a.embodiedCarbon).map(metric => (
                                <div key={metric.category} className="group">
                                    <div className="flex justify-between text-sm mb-1">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded" style={{ backgroundColor: metric.color }} />
                                            <span className="text-gray-300">{metric.category}</span>
                                        </div>
                                        <span className={metric.embodiedCarbon < 0 ? 'text-green-400' : 'text-gray-400'}>
                                            {formatCarbon(metric.embodiedCarbon)}
                                        </span>
                                    </div>
                                    <div className="h-5 bg-gray-700/50 rounded relative overflow-hidden">
                                        {metric.embodiedCarbon >= 0 ? (
                                            <div
                                                className="h-full rounded-l transition-all duration-500"
                                                style={{
                                                    width: `${(metric.embodiedCarbon / Math.max(...metrics.map(m => m.embodiedCarbon))) * 100}%`,
                                                    backgroundColor: metric.color
                                                }}
                                            />
                                        ) : (
                                            <div
                                                className="h-full rounded bg-green-500 absolute right-0"
                                                style={{
                                                    width: `${(Math.abs(metric.embodiedCarbon) / Math.max(...metrics.map(m => Math.abs(m.embodiedCarbon)))) * 50}%`
                                                }}
                                            />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Detailed metrics table */}
                    <div className="mt-6">
                        <h4 className="text-sm font-medium text-gray-300 mb-3">Material Performance Details</h4>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-gray-400 border-b border-gray-700">
                                        <th className="text-left py-2 px-2">Material</th>
                                        <th className="text-center py-2 px-2">Energy Grade</th>
                                        <th className="text-right py-2 px-2">Recyclable %</th>
                                        <th className="text-left py-2 px-2">Certification</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {metrics.map(metric => (
                                        <tr key={metric.category} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                                            <td className="py-2 px-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: metric.color }} />
                                                    <span className="text-gray-200">{metric.category}</span>
                                                </div>
                                            </td>
                                            <td className="py-2 px-2 text-center">
                                                <span
                                                    className="inline-block w-8 h-6 rounded text-xs font-bold leading-6 text-white"
                                                    style={{ backgroundColor: getPerformanceColor(metric.energyPerformance) }}
                                                >
                                                    {metric.energyPerformance}
                                                </span>
                                            </td>
                                            <td className="py-2 px-2 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-blue-500 rounded-full"
                                                            style={{ width: `${metric.recyclableContent}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-gray-300 w-8">{metric.recyclableContent}%</span>
                                                </div>
                                            </td>
                                            <td className="py-2 px-2">
                                                <span className="px-2 py-0.5 bg-gray-700 text-gray-300 rounded text-xs">
                                                    {metric.certification}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer with legend */}
            <div className="p-4 border-t border-gray-700">
                <div className="flex items-center justify-between text-xs text-gray-400">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded bg-green-500" /> Carbon Negative
                        </span>
                        <span className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded bg-gray-500" /> Carbon Positive
                        </span>
                    </div>
                    <span>Data from AEC Data Model custom properties</span>
                </div>
            </div>
        </div>
    );
}
