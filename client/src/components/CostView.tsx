'use client';

import { useState, useEffect, ReactNode } from 'react';
import { useApp } from '@/contexts/AppContext';

interface CostCategory {
    name: string;
    quantity: number;
    unit: string;
    unitCost: number;
    totalCost: number;
    color: string;
}

export default function CostView() {
    const { currentProject } = useApp();
    const [categories, setCategories] = useState<CostCategory[]>([]);
    const [totalBudget, setTotalBudget] = useState(5000000);
    const [viewType, setViewType] = useState<'chart' | 'table'>('chart');

    // Mock data for demonstration
    useEffect(() => {
        setCategories([
            { name: 'Structural', quantity: 450, unit: 'm³', unitCost: 850, totalCost: 382500, color: '#3b82f6' },
            { name: 'Walls', quantity: 2800, unit: 'm²', unitCost: 120, totalCost: 336000, color: '#10b981' },
            { name: 'Windows & Doors', quantity: 180, unit: 'units', unitCost: 1200, totalCost: 216000, color: '#f59e0b' },
            { name: 'Roofing', quantity: 1200, unit: 'm²', unitCost: 180, totalCost: 216000, color: '#ef4444' },
            { name: 'MEP Systems', quantity: 1, unit: 'lot', unitCost: 850000, totalCost: 850000, color: '#8b5cf6' },
            { name: 'Finishes', quantity: 3500, unit: 'm²', unitCost: 85, totalCost: 297500, color: '#ec4899' },
            { name: 'Site Work', quantity: 1, unit: 'lot', unitCost: 180000, totalCost: 180000, color: '#06b6d4' },
        ]);
    }, [currentProject]);

    const totalCost = categories.reduce((sum, cat) => sum + cat.totalCost, 0);
    const budgetUsed = (totalCost / totalBudget) * 100;

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    };

    return (
        <div className="h-full flex flex-col bg-gray-800/50 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-gray-700">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">5D Cost Analysis</h3>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setViewType('chart')}
                            className={`px-3 py-1 rounded-lg text-sm transition-colors ${viewType === 'chart' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                }`}
                        >
                            Chart
                        </button>
                        <button
                            onClick={() => setViewType('table')}
                            className={`px-3 py-1 rounded-lg text-sm transition-colors ${viewType === 'table' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                }`}
                        >
                            Table
                        </button>
                    </div>
                </div>

                {/* Budget overview */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gray-700/50 rounded-lg p-3">
                        <div className="text-xs text-gray-400 mb-1">Total Budget</div>
                        <div className="text-xl font-bold text-white">{formatCurrency(totalBudget)}</div>
                    </div>
                    <div className="bg-gray-700/50 rounded-lg p-3">
                        <div className="text-xs text-gray-400 mb-1">Estimated Cost</div>
                        <div className="text-xl font-bold text-blue-400">{formatCurrency(totalCost)}</div>
                    </div>
                    <div className="bg-gray-700/50 rounded-lg p-3">
                        <div className="text-xs text-gray-400 mb-1">Remaining</div>
                        <div className={`text-xl font-bold ${totalBudget - totalCost >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {formatCurrency(totalBudget - totalCost)}
                        </div>
                    </div>
                </div>

                {/* Budget progress bar */}
                <div className="mt-4">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>Budget Utilization</span>
                        <span>{budgetUsed.toFixed(1)}%</span>
                    </div>
                    <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                        <div
                            className={`h-full transition-all duration-500 ${budgetUsed > 100 ? 'bg-red-500' : budgetUsed > 80 ? 'bg-yellow-500' : 'bg-green-500'}`}
                            style={{ width: `${Math.min(budgetUsed, 100)}%` }}
                        />
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                {viewType === 'chart' ? (
                    <div className="space-y-6">
                        {/* Bar chart */}
                        <div className="space-y-3">
                            {categories.map(cat => (
                                <div key={cat.name} className="group">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-300">{cat.name}</span>
                                        <span className="text-gray-400">{formatCurrency(cat.totalCost)}</span>
                                    </div>
                                    <div className="h-6 bg-gray-700/50 rounded relative overflow-hidden">
                                        <div
                                            className="h-full rounded transition-all duration-500 group-hover:opacity-80"
                                            style={{
                                                width: `${(cat.totalCost / totalCost) * 100}%`,
                                                backgroundColor: cat.color
                                            }}
                                        />
                                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-white font-medium">
                                            {((cat.totalCost / totalCost) * 100).toFixed(1)}%
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pie chart representation */}
                        <div className="flex justify-center mt-8">
                            <div className="relative w-48 h-48">
                                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                                    {categories.reduce((acc, cat, index) => {
                                        const percentage = (cat.totalCost / totalCost) * 100;
                                        const offset = acc.offset;
                                        acc.elements.push(
                                            <circle
                                                key={cat.name}
                                                cx="50"
                                                cy="50"
                                                r="40"
                                                fill="none"
                                                stroke={cat.color}
                                                strokeWidth="20"
                                                strokeDasharray={`${percentage * 2.51327} ${251.327 - percentage * 2.51327}`}
                                                strokeDashoffset={-offset * 2.51327}
                                                className="transition-all duration-500"
                                            />
                                        );
                                        acc.offset += percentage;
                                        return acc;
                                    }, { elements: [] as ReactNode[], offset: 0 }).elements}
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-white">{formatCurrency(totalCost)}</div>
                                        <div className="text-xs text-gray-400">Total Cost</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-gray-400 border-b border-gray-700">
                                    <th className="text-left py-2 px-3">Category</th>
                                    <th className="text-right py-2 px-3">Quantity</th>
                                    <th className="text-right py-2 px-3">Unit</th>
                                    <th className="text-right py-2 px-3">Unit Cost</th>
                                    <th className="text-right py-2 px-3">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map(cat => (
                                    <tr key={cat.name} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                                        <td className="py-2 px-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded" style={{ backgroundColor: cat.color }} />
                                                <span className="text-gray-200">{cat.name}</span>
                                            </div>
                                        </td>
                                        <td className="text-right py-2 px-3 text-gray-300">{cat.quantity.toLocaleString()}</td>
                                        <td className="text-right py-2 px-3 text-gray-400">{cat.unit}</td>
                                        <td className="text-right py-2 px-3 text-gray-300">{formatCurrency(cat.unitCost)}</td>
                                        <td className="text-right py-2 px-3 text-white font-medium">{formatCurrency(cat.totalCost)}</td>
                                    </tr>
                                ))}
                                <tr className="bg-gray-700/30 font-medium">
                                    <td colSpan={4} className="py-2 px-3 text-gray-200">Total</td>
                                    <td className="text-right py-2 px-3 text-blue-400">{formatCurrency(totalCost)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
