import React from 'react';
import {
  Zap,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
  Bot,
  Compass,
} from 'lucide-react';
import { useGuideStore } from '../../framework/store/guideStore';
import { mascotRegistry } from '../../framework/registries/mascotRegistry';
import { tourRegistry } from '../../framework/registries/tourRegistry';
import { synthAudio } from '../../framework/audio/synthAudio';

export const HeaderBar: React.FC = () => {
  const {
    activeMascotId,
    setMascot,
    tourProviderId,
    setTourProvider,
    soundEnabled,
    toggleSound,
    startTour,
    tourActive,
    resetForm,
    config,
  } = useGuideStore();

  const mascots = mascotRegistry.getAll();
  const tourProviders = tourRegistry.getAll();

  const handleStartTour = () => {
    if (tourProviderId === 'driver') {
      const providerFactory = tourRegistry.get('driver');
      if (providerFactory && config) {
        const steps = Object.values(config.components)
          .filter((c) => Boolean(c.walkthrough))
          .map((c) => ({
            stepIndex: c.walkthrough!.stepIndex,
            componentId: c.componentId,
            title: c.walkthrough!.title,
            description: c.walkthrough!.description,
            placement: c.walkthrough!.placement,
          }));

        const provider = providerFactory();
        provider.start(
          steps,
          (stepNum) => {
            const comp = Object.values(config.components).find(
              (c) => c.walkthrough?.stepIndex === stepNum
            );
            if (comp) {
              useGuideStore.setState({
                activeComponentId: comp.componentId,
                currentMessage: comp.walkthrough?.description || comp.label,
                currentExpression: 'guiding',
                tourStep: stepNum,
                tourActive: true,
              });
            }
          },
          () => {
            useGuideStore.getState().endTour();
          }
        );
      }
    } else {
      startTour();
    }
  };

  return (
    <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl px-6 py-3.5 sticky top-0 z-40 flex flex-wrap items-center justify-between gap-4">
      {/* Brand & Framework Title */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-lime-500/10 rounded-xl border border-lime-500/30 text-lime-400 shadow-md shadow-lime-500/10">
          <Zap className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold text-slate-100 tracking-tight">
              Metadata-Driven Mascot Framework
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-lime-400 border border-slate-700">
              v1.0.0
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Pluggable, Zero-AI Guided Assistant & Onboarding Pipeline Studio
          </p>
        </div>
      </div>

      {/* Control Actions & Selectors */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Mascot Selector */}
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs">
          <Bot className="w-3.5 h-3.5 text-lime-400" />
          <span className="text-slate-400 text-[11px] font-medium">Mascot:</span>
          <select
            value={activeMascotId}
            onChange={(e) => setMascot(e.target.value)}
            className="bg-transparent text-slate-100 font-semibold focus:outline-none cursor-pointer text-xs"
          >
            {mascots.map((m) => (
              <option key={m.id} value={m.id} className="bg-slate-900 text-slate-100">
                {m.name}
              </option>
            ))}
          </select>
        </div>

        {/* Tour Engine Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs">
          <Compass className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-400 text-[11px] font-medium">Tour:</span>
          <select
            value={tourProviderId}
            onChange={(e) => setTourProvider(e.target.value)}
            className="bg-transparent text-slate-100 font-semibold focus:outline-none cursor-pointer text-xs"
          >
            {tourProviders.map((p) => (
              <option key={p.id} value={p.id} className="bg-slate-900 text-slate-100">
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Audio Toggle */}
        <button
          onClick={() => {
            toggleSound();
            synthAudio.toggleMute();
          }}
          className={`p-2 rounded-xl border transition-all text-xs flex items-center justify-center cursor-pointer ${
            soundEnabled
              ? 'bg-slate-900 text-lime-400 border-lime-500/40 shadow-sm shadow-lime-500/10'
              : 'bg-slate-900 text-slate-500 border-slate-800'
          }`}
          title={soundEnabled ? 'Mute Synthetic Audio' : 'Unmute Synthetic Audio'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Start Tour Button */}
        <button
          onClick={handleStartTour}
          disabled={tourActive}
          className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl bg-lime-500 text-slate-950 hover:bg-lime-400 disabled:opacity-50 transition-all shadow-md shadow-lime-500/20 cursor-pointer active:scale-95"
        >
          <Play className="w-3.5 h-3.5 fill-current" /> Start Guided Tour
        </button>

        {/* Reset Button */}
        <button
          onClick={() => resetForm()}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700 cursor-pointer"
          title="Reset Form & Guide State"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset
        </button>
      </div>
    </header>
  );
};
