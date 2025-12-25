'use client';

import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';
import { API_BASE_URL } from '@/config';

declare global {
    interface Window {
        Autodesk: any;
    }
}

interface ViewerProps {
    onSelectionChange?: (dbIds: number[]) => void;
}

export default function Viewer({ onSelectionChange }: ViewerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const viewerRef = useRef<any>(null);
    const { accessToken } = useAuth();
    const { currentModel, viewMode, timelineDate } = useApp();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Initialize viewer
    useEffect(() => {
        if (!containerRef.current || !accessToken) return;

        const options = {
            env: 'AutodeskProduction2',
            api: 'streamingV2',
            accessToken: accessToken
        };

        window.Autodesk.Viewing.Initializer(options, () => {
            const viewer = new window.Autodesk.Viewing.GuiViewer3D(containerRef.current);
            viewer.start();
            viewerRef.current = viewer;

            // Set up selection listener
            viewer.addEventListener(window.Autodesk.Viewing.SELECTION_CHANGED_EVENT, (event: any) => {
                if (onSelectionChange) {
                    onSelectionChange(event.dbIdArray || []);
                }
            });
        });

        return () => {
            if (viewerRef.current) {
                viewerRef.current.finish();
                viewerRef.current = null;
            }
        };
    }, [accessToken]);

    // Load model when changed
    useEffect(() => {
        if (!viewerRef.current || !currentModel) return;

        setIsLoading(true);
        setError(null);

        const documentId = `urn:${currentModel.urn}`;

        window.Autodesk.Viewing.Document.load(
            documentId,
            (doc: any) => {
                const viewables = doc.getRoot().getDefaultGeometry();
                viewerRef.current.loadDocumentNode(doc, viewables).then(() => {
                    setIsLoading(false);
                });
            },
            (errorCode: number, errorMessage: string) => {
                setError(`Failed to load model: ${errorMessage}`);
                setIsLoading(false);
            }
        );
    }, [currentModel]);

    // Apply 4D visualization based on timeline date
    useEffect(() => {
        if (!viewerRef.current || viewMode !== '4d') return;

        // This would apply coloring based on schedule status
        // Implementation depends on the schedule data structure
        applyTimelineVisualization(viewerRef.current, timelineDate);
    }, [viewMode, timelineDate]);

    return (
        <div className="relative w-full h-full bg-gray-900 rounded-xl overflow-hidden">
            <div ref={containerRef} className="w-full h-full" />

            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        <span className="text-white text-sm">Loading model...</span>
                    </div>
                </div>
            )}

            {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 max-w-md">
                        <p className="text-red-400">{error}</p>
                    </div>
                </div>
            )}

            {!currentModel && !isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-gray-400">
                        <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        <p>Select a model to view</p>
                    </div>
                </div>
            )}
        </div>
    );
}

// Helper function to apply timeline-based coloring
function applyTimelineVisualization(viewer: any, date: Date) {
    // This would be enhanced with actual schedule data
    // For now, it's a placeholder for the 4D visualization logic
    console.log('Applying timeline visualization for date:', date);
}
