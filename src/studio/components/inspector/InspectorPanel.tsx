import React, { useState } from 'react';
import { Activity, Code2, Database, Puzzle, Smile } from 'lucide-react';
import { TelemetryTab } from './TelemetryTab';
import { SchemaEditorTab } from './SchemaEditorTab';
import { StateStoreTab } from './StateStoreTab';
import { PluginsTab } from './PluginsTab';
import { EmotionSandboxTab } from './EmotionSandboxTab';

export type InspectorTabType = 'telemetry' | 'schema' | 'state' | 'plugins' | 'emotions';

export const InspectorPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<InspectorTabType>('telemetry');

  const tabs: { id: InspectorTabType; label: string; icon: React.ReactNode }[] = [
    { id: 'telemetry', label: 'Telemetry Stream', icon: <Activity className="w-3.5 h-3.5" /> },
    { id: 'schema', label: 'Schema Editor', icon: <Code2 className="w-3.5 h-3.5" /> },
    { id: 'state', label: 'Store State', icon: <Database className="w-3.5 h-3.5" /> },
    { id: 'plugins', label: 'Plugins & Registries', icon: <Puzzle className="w-3.5 h-3.5" /> },
    { id: 'emotions', label: 'Emotion Sandbox', icon: <Smile className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-2xl flex flex-col h-[640px] backdrop-blur-xl">
      {/* Tab Switcher */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-950/90 rounded-2xl border border-slate-800/80 mb-4 overflow-x-auto shrink-0">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-slate-800 text-lime-400 border border-lime-500/30 shadow-md shadow-lime-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Active Tab Content Area */}
      <div className="flex-1 overflow-hidden min-h-0">
        {activeTab === 'telemetry' && <TelemetryTab />}
        {activeTab === 'schema' && <SchemaEditorTab />}
        {activeTab === 'state' && <StateStoreTab />}
        {activeTab === 'plugins' && <PluginsTab />}
        {activeTab === 'emotions' && <EmotionSandboxTab />}
      </div>
    </div>
  );
};
