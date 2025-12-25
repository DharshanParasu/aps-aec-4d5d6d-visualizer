'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';
import { API_BASE_URL } from '@/config';

interface Hub {
    id: string;
    attributes: { name: string };
}

interface Project {
    id: string;
    attributes: { name: string };
}

interface FolderItem {
    id: string;
    type: string;
    attributes: {
        name: string;
        displayName?: string;
        extension?: { type: string };
    };
}

export default function ModelSelector() {
    const { isAuthenticated } = useAuth();
    const { setCurrentHub, setCurrentProject, setCurrentModel, currentHub, currentProject } = useApp();

    const [hubs, setHubs] = useState<Hub[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [folderStack, setFolderStack] = useState<{ id: string; name: string }[]>([]);
    const [items, setItems] = useState<FolderItem[]>([]);
    const [loading, setLoading] = useState(false);

    // Fetch hubs
    useEffect(() => {
        if (!isAuthenticated) return;

        const fetchHubs = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${API_BASE_URL}/api/data/hubs`);
                const data = await response.json();
                setHubs(data.data || []);
            } catch (error) {
                console.error('Error fetching hubs:', error);
            }
            setLoading(false);
        };

        fetchHubs();
    }, [isAuthenticated]);

    // Fetch projects when hub selected
    useEffect(() => {
        if (!currentHub) return;

        const fetchProjects = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${API_BASE_URL}/api/data/hubs/${currentHub}/projects`);
                const data = await response.json();
                setProjects(data.data || []);
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
            setLoading(false);
        };

        fetchProjects();
    }, [currentHub]);

    // Fetch folder contents
    const fetchFolderContents = async (folderId: string, folderName: string) => {
        if (!currentProject) return;

        setLoading(true);
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/data/projects/${currentProject}/folders/${folderId}/contents`
            );
            const data = await response.json();
            setItems(data.data || []);
            setFolderStack(prev => [...prev, { id: folderId, name: folderName }]);
        } catch (error) {
            console.error('Error fetching folder contents:', error);
        }
        setLoading(false);
    };

    // Fetch top folders when project selected
    useEffect(() => {
        if (!currentProject) return;

        const fetchTopFolders = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${API_BASE_URL}/api/data/projects/${currentProject}/topFolders`);
                const data = await response.json();
                setItems(data.data || []);
                setFolderStack([]);
            } catch (error) {
                console.error('Error fetching top folders:', error);
            }
            setLoading(false);
        };

        fetchTopFolders();
    }, [currentProject]);

    const handleSelectItem = (item: FolderItem) => {
        if (item.type === 'folders') {
            fetchFolderContents(item.id, item.attributes.displayName || item.attributes.name);
        } else if (item.type === 'items') {
            // Check if it's a viewable file (RVT, IFC, etc.)
            const urn = btoa(item.id).replace(/=/g, '');
            setCurrentModel({ urn, name: item.attributes.displayName || item.attributes.name });
        }
    };

    const navigateBack = () => {
        if (folderStack.length > 1) {
            const newStack = [...folderStack];
            newStack.pop();
            const parentFolder = newStack[newStack.length - 1];
            setFolderStack(newStack.slice(0, -1));
            fetchFolderContents(parentFolder.id, parentFolder.name);
        } else {
            setFolderStack([]);
            // Re-fetch top folders
            if (currentProject) {
                fetch(`${API_BASE_URL}/api/data/projects/${currentProject}/topFolders`)
                    .then(r => r.json())
                    .then(data => setItems(data.data || []));
            }
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="p-4 text-gray-400 text-center">
                Please sign in to browse models
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-gray-800/50 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-3">Model Browser</h3>

                {/* Hub Selector */}
                <select
                    value={currentHub || ''}
                    onChange={(e) => {
                        setCurrentHub(e.target.value || null);
                        setCurrentProject(null);
                        setItems([]);
                        setFolderStack([]);
                    }}
                    className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 mb-2 border border-gray-600 focus:border-blue-500 focus:outline-none"
                >
                    <option value="">Select Hub</option>
                    {hubs.map(hub => (
                        <option key={hub.id} value={hub.id}>{hub.attributes.name}</option>
                    ))}
                </select>

                {/* Project Selector */}
                {currentHub && (
                    <select
                        value={currentProject || ''}
                        onChange={(e) => {
                            setCurrentProject(e.target.value || null);
                            setFolderStack([]);
                        }}
                        className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-blue-500 focus:outline-none"
                    >
                        <option value="">Select Project</option>
                        {projects.map(project => (
                            <option key={project.id} value={project.id}>{project.attributes.name}</option>
                        ))}
                    </select>
                )}
            </div>

            {/* Breadcrumb */}
            {folderStack.length > 0 && (
                <div className="px-4 py-2 border-b border-gray-700 flex items-center gap-2 text-sm">
                    <button onClick={navigateBack} className="text-blue-400 hover:text-blue-300">
                        ← Back
                    </button>
                    <span className="text-gray-400">/</span>
                    <span className="text-gray-300 truncate">
                        {folderStack[folderStack.length - 1]?.name}
                    </span>
                </div>
            )}

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-2">
                {loading ? (
                    <div className="flex items-center justify-center h-32">
                        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : items.length === 0 ? (
                    <div className="text-gray-500 text-center py-8">
                        {currentProject ? 'No items found' : 'Select a project to browse'}
                    </div>
                ) : (
                    <ul className="space-y-1">
                        {items.map(item => (
                            <li key={item.id}>
                                <button
                                    onClick={() => handleSelectItem(item)}
                                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-700/50 transition-colors text-left"
                                >
                                    {item.type === 'folders' ? (
                                        <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    )}
                                    <span className="text-gray-200 truncate">
                                        {item.attributes.displayName || item.attributes.name}
                                    </span>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
