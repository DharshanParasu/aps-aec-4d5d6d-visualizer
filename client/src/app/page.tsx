'use client';

import { useState, ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useApp, ViewMode } from '@/contexts/AppContext';
import Viewer from '@/components/Viewer';
import ModelSelector from '@/components/ModelSelector';
import PropertyPanel from '@/components/PropertyPanel';
import TimelineView from '@/components/TimelineView';
import CostView from '@/components/CostView';
import SustainabilityView from '@/components/SustainabilityView';

const VIEW_TABS: { id: ViewMode; label: string; icon: ReactNode }[] = [
  {
    id: '3d',
    label: '3D Model',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
      </svg>
    )
  },
  {
    id: '4d',
    label: '4D Schedule',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )
  },
  {
    id: '5d',
    label: '5D Cost',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    id: '6d',
    label: '6D Sustainability',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  }
];

export default function Home() {
  const { isAuthenticated, login, logout } = useAuth();
  const { viewMode, setViewMode, currentModel } = useApp();
  const [selectedDbIds, setSelectedDbIds] = useState<number[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="glass border-b border-gray-700/50 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">APS AEC Visualizer</h1>
              <p className="text-xs text-gray-400">4D · 5D · 6D BIM Intelligence</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {currentModel && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 rounded-lg">
              <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-sm text-gray-300 max-w-[200px] truncate">{currentModel.name}</span>
            </div>
          )}

          {isAuthenticated ? (
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-gray-300 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          ) : (
            <button
              onClick={login}
              className="btn-primary flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Sign in with Autodesk
            </button>
          )}
        </div>
      </header>

      {/* View Mode Tabs */}
      <div className="glass border-b border-gray-700/50 px-6">
        <div className="flex items-center gap-1">
          {VIEW_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setViewMode(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all relative ${viewMode === tab.id
                ? 'text-blue-400'
                : 'text-gray-400 hover:text-gray-200'
                }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {viewMode === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-emerald-500" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 overflow-hidden border-r border-gray-700/50`}>
          <div className="h-full p-4 overflow-y-auto">
            <ModelSelector />
          </div>
        </aside>

        {/* Toggle Sidebar */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gray-800 hover:bg-gray-700 p-1 rounded-r-lg transition-colors"
          style={{ left: sidebarOpen ? '320px' : '0' }}
        >
          <svg className={`w-4 h-4 text-gray-400 transition-transform ${sidebarOpen ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Center Content */}
        <div className="flex-1 flex flex-col p-4 min-w-0">
          <div className="flex-1 flex gap-4 min-h-0">
            {/* Viewer / View Content */}
            <div className="flex-1 min-w-0 tab-content">
              {viewMode === '3d' && (
                <Viewer onSelectionChange={setSelectedDbIds} />
              )}
              {viewMode === '4d' && (
                <div className="h-full flex flex-col gap-4">
                  <div className="flex-1 min-h-0">
                    <Viewer onSelectionChange={setSelectedDbIds} />
                  </div>
                  <div className="h-80">
                    <TimelineView />
                  </div>
                </div>
              )}
              {viewMode === '5d' && (
                <div className="h-full">
                  <CostView />
                </div>
              )}
              {viewMode === '6d' && (
                <div className="h-full">
                  <SustainabilityView />
                </div>
              )}
            </div>

            {/* Properties Panel - show on 3D and 4D views */}
            {(viewMode === '3d' || viewMode === '4d') && (
              <div className="w-80 shrink-0">
                <PropertyPanel selectedDbIds={selectedDbIds} />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="glass border-t border-gray-700/50 px-6 py-2">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Powered by Autodesk Platform Services & AEC Data Model API</span>
          <span>© 2024 APS AEC Visualizer</span>
        </div>
      </footer>
    </div>
  );
}
