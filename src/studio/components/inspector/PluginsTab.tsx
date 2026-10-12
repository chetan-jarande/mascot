import React, { useState } from 'react';
import { Plus, Check, Puzzle, ShieldCheck, Compass, Radio } from 'lucide-react';
import { mascotRegistry } from '../../../framework/registries/mascotRegistry';
import { validationRegistry } from '../../../framework/registries/validationRegistry';
import { tourRegistry } from '../../../framework/registries/tourRegistry';
import { telemetryPipeline } from '../../../framework/registries/telemetryPipeline';

export const PluginsTab: React.FC = () => {
  const mascots = mascotRegistry.getAll();
  const validators = validationRegistry.getAll();
  const tourProviders = tourRegistry.getAll();
  const sinkCount = telemetryPipeline.getSinkCount();

  const [ruleName, setRuleName] = useState('');
  const [prefix, setPrefix] = useState('');
  const [added, setAdded] = useState(false);

  const handleRegisterRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleName.trim() || !prefix.trim()) return;

    validationRegistry.register(ruleName.trim(), (val) => {
      return typeof val === 'string' && val.startsWith(prefix.trim());
    });

    setAdded(true);
    setRuleName('');
    setPrefix('');
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto space-y-4 text-xs pr-1">
      {/* Overview Banner */}
      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Puzzle className="w-4 h-4 text-lime-400" />
          <span className="font-semibold text-slate-200">Decoupled Registries</span>
        </div>
        <span className="text-[10px] text-lime-400 font-mono bg-lime-500/10 px-2 py-0.5 rounded border border-lime-500/30">
          Plug-in-Play Architecture
        </span>
      </div>

      {/* Mascots Registry */}
      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2 mb-2 font-semibold text-slate-300">
          <ShieldCheck className="w-3.5 h-3.5 text-lime-400" /> Registered Mascot Avatars ({mascots.length})
        </div>
        <div className="space-y-2">
          {mascots.map((m) => (
            <div key={m.id} className="p-2 bg-slate-900 rounded-lg border border-slate-800">
              <div className="flex items-center justify-between font-bold text-slate-200">
                <span>{m.name}</span>
                <span className="text-[10px] font-mono text-slate-400">id: {m.id}</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">{m.description}</p>
              <div className="mt-1 text-[10px] text-lime-400 font-mono">
                Personality: {m.personality}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Validation Registry & Live Dynamic Rule Creator */}
      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2 mb-2 font-semibold text-slate-300">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> Registered Custom Validators (
          {validators.length})
        </div>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {validators.map((v) => (
            <span
              key={v}
              className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-mono"
            >
              {v}
            </span>
          ))}
        </div>

        {/* Dynamic Plugin Form */}
        <form onSubmit={handleRegisterRule} className="p-2.5 bg-slate-900/90 rounded-lg border border-slate-800 space-y-2">
          <div className="text-[11px] font-semibold text-slate-300 flex items-center justify-between">
            <span>Register New Custom Rule at Runtime</span>
            {added && <span className="text-emerald-400 font-bold flex items-center gap-1"><Check className="w-3 h-3" /> Registered!</span>}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Rule ID (e.g. tax_id)"
              value={ruleName}
              onChange={(e) => setRuleName(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-[11px] text-slate-200"
            />
            <input
              type="text"
              placeholder="Must start with..."
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-[11px] text-slate-200"
            />
          </div>
          <button
            type="submit"
            className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-lime-400 rounded text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors border border-slate-700 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Plug into Validation Engine
          </button>
        </form>
      </div>

      {/* Tour Providers & Telemetry Pipeline */}
      <div className="grid grid-cols-2 gap-2">
        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
          <div className="flex items-center gap-2 mb-2 font-semibold text-slate-300">
            <Compass className="w-3.5 h-3.5 text-cyan-400" /> Tour Engines ({tourProviders.length})
          </div>
          <div className="space-y-1">
            {tourProviders.map((tp) => (
              <div key={tp.id} className="text-[11px] font-mono text-cyan-300 bg-slate-900 p-1.5 rounded border border-slate-800">
                {tp.name}
              </div>
            ))}
          </div>
        </div>

        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
          <div className="flex items-center gap-2 mb-2 font-semibold text-slate-300">
            <Radio className="w-3.5 h-3.5 text-purple-400" /> Telemetry Sinks
          </div>
          <div className="text-[11px] text-slate-400">
            Active Listeners: <span className="font-bold text-purple-400">{sinkCount}</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            Ready for PostHog, Mixpanel, Datadog or custom analytics endpoints.
          </p>
        </div>
      </div>
    </div>
  );
};
