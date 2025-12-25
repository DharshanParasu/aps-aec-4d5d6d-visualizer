'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { CONSTRUCTION_STATUS_OPTIONS } from '@/config';

interface TimelineElement {
    id: string;
    name: string;
    plannedStart: string;
    plannedFinish: string;
    status: string;
}

export default function TimelineView() {
    const { timelineDate, setTimelineDate, currentProject } = useApp();
    const [elements, setElements] = useState<TimelineElement[]>([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playSpeed, setPlaySpeed] = useState(1);

    // Mock data for demonstration
    useEffect(() => {
        // In production, fetch from AEC Data Model
        setElements([
            { id: '1', name: 'Foundation', plannedStart: '2024-01-01', plannedFinish: '2024-02-15', status: 'completed' },
            { id: '2', name: 'Structural Frame', plannedStart: '2024-02-01', plannedFinish: '2024-04-30', status: 'in_progress' },
            { id: '3', name: 'Exterior Walls', plannedStart: '2024-03-15', plannedFinish: '2024-06-30', status: 'in_progress' },
            { id: '4', name: 'Roofing', plannedStart: '2024-05-01', plannedFinish: '2024-07-15', status: 'not_started' },
            { id: '5', name: 'MEP Systems', plannedStart: '2024-06-01', plannedFinish: '2024-09-30', status: 'not_started' },
            { id: '6', name: 'Interior Finishes', plannedStart: '2024-08-01', plannedFinish: '2024-11-30', status: 'not_started' },
        ]);
    }, [currentProject]);

    // Calculate timeline bounds
    const minDate = new Date('2024-01-01');
    const maxDate = new Date('2024-12-31');
    const totalDays = Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));

    const getStatusColor = (status: string) => {
        return CONSTRUCTION_STATUS_OPTIONS.find(opt => opt.value === status)?.color || '#6b7280';
    };

    const getElementPosition = (start: string, end: string) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const startDays = Math.ceil((startDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));
        const durationDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

        return {
            left: `${(startDays / totalDays) * 100}%`,
            width: `${(durationDays / totalDays) * 100}%`
        };
    };

    const currentDatePosition = () => {
        const days = Math.ceil((timelineDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));
        return `${(days / totalDays) * 100}%`;
    };

    // Playback effect
    useEffect(() => {
        if (!isPlaying) return;

        const interval = setInterval(() => {
            const currentDate = timelineDate;
            const next = new Date(currentDate);
            next.setDate(next.getDate() + playSpeed);
            if (next > maxDate) {
                setIsPlaying(false);
                setTimelineDate(minDate);
            } else {
                setTimelineDate(next);
            }
        }, 100);

        return () => clearInterval(interval);
    }, [isPlaying, playSpeed, setTimelineDate, timelineDate, minDate, maxDate]);

    return (
        <div className="h-full flex flex-col bg-gray-800/50 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-gray-700">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">4D Construction Timeline</h3>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setTimelineDate(minDate)}
                            className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
                            title="Reset to start"
                        >
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
                            </svg>
                        </button>
                        <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            className={`p-2 rounded-lg transition-colors ${isPlaying ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                        >
                            {isPlaying ? (
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                                </svg>
                            ) : (
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            )}
                        </button>
                        <select
                            value={playSpeed}
                            onChange={(e) => setPlaySpeed(Number(e.target.value))}
                            className="bg-gray-700 text-white text-sm rounded-lg px-2 py-1 border border-gray-600"
                        >
                            <option value={1}>1x</option>
                            <option value={2}>2x</option>
                            <option value={5}>5x</option>
                            <option value={10}>10x</option>
                        </select>
                    </div>
                </div>

                {/* Date display */}
                <div className="text-center">
                    <span className="text-2xl font-bold text-white">
                        {timelineDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                </div>
            </div>

            {/* Timeline slider */}
            <div className="px-4 py-3 border-b border-gray-700">
                <input
                    type="range"
                    min={minDate.getTime()}
                    max={maxDate.getTime()}
                    value={timelineDate.getTime()}
                    onChange={(e) => setTimelineDate(new Date(Number(e.target.value)))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Jan 2024</span>
                    <span>Jun 2024</span>
                    <span>Dec 2024</span>
                </div>
            </div>

            {/* Gantt-style view */}
            <div className="flex-1 overflow-y-auto p-4">
                <div className="relative">
                    {/* Current date indicator */}
                    <div
                        className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10"
                        style={{ left: currentDatePosition() }}
                    />

                    {/* Elements */}
                    <div className="space-y-2">
                        {elements.map(element => {
                            const pos = getElementPosition(element.plannedStart, element.plannedFinish);
                            const isBeforeDate = new Date(element.plannedStart) <= timelineDate;
                            const isAfterDate = new Date(element.plannedFinish) < timelineDate;

                            return (
                                <div key={element.id} className="flex items-center gap-3">
                                    <div className="w-32 text-sm text-gray-300 truncate">{element.name}</div>
                                    <div className="flex-1 h-8 bg-gray-700/50 rounded relative">
                                        <div
                                            className="absolute h-full rounded transition-all duration-300"
                                            style={{
                                                left: pos.left,
                                                width: pos.width,
                                                backgroundColor: getStatusColor(element.status),
                                                opacity: isBeforeDate ? 1 : 0.3
                                            }}
                                        >
                                            {isAfterDate && element.status === 'completed' && (
                                                <svg className="w-4 h-4 text-white absolute right-1 top-1/2 -translate-y-1/2" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className="p-4 border-t border-gray-700">
                <div className="flex flex-wrap gap-4 justify-center">
                    {CONSTRUCTION_STATUS_OPTIONS.map(status => (
                        <div key={status.value} className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded" style={{ backgroundColor: status.color }} />
                            <span className="text-xs text-gray-400">{status.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
