'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ViewMode = '3d' | '4d' | '5d' | '6d';

interface SelectedElement {
    id: string;
    externalId: string;
    name?: string;
    category?: string;
    properties?: Record<string, any>;
}

interface AppContextType {
    viewMode: ViewMode;
    setViewMode: (mode: ViewMode) => void;
    selectedElements: SelectedElement[];
    setSelectedElements: (elements: SelectedElement[]) => void;
    currentHub: string | null;
    setCurrentHub: (hubId: string | null) => void;
    currentProject: string | null;
    setCurrentProject: (projectId: string | null) => void;
    currentModel: { urn: string; name: string } | null;
    setCurrentModel: (model: { urn: string; name: string } | null) => void;
    timelineDate: Date;
    setTimelineDate: (date: Date) => void;
}

const AppContext = createContext<AppContextType | null>(null);

// Fixed date for initial SSR render to avoid hydration mismatch
const INITIAL_DATE = new Date('2024-06-01');

export function AppProvider({ children }: { children: ReactNode }) {
    const [viewMode, setViewMode] = useState<ViewMode>('3d');
    const [selectedElements, setSelectedElements] = useState<SelectedElement[]>([]);
    const [currentHub, setCurrentHub] = useState<string | null>(null);
    const [currentProject, setCurrentProject] = useState<string | null>(null);
    const [currentModel, setCurrentModel] = useState<{ urn: string; name: string } | null>(null);
    const [timelineDate, setTimelineDate] = useState<Date>(INITIAL_DATE);

    // Update to current date after hydration
    useEffect(() => {
        // Keep using the fixed date for the timeline (better UX for demo)
        // If you want current date, uncomment: setTimelineDate(new Date());
    }, []);

    return (
        <AppContext.Provider value={{
            viewMode,
            setViewMode,
            selectedElements,
            setSelectedElements,
            currentHub,
            setCurrentHub,
            currentProject,
            setCurrentProject,
            currentModel,
            setCurrentModel,
            timelineDate,
            setTimelineDate
        }}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
}
