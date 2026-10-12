import React, { useEffect } from 'react';
import { HeaderBar } from './components/HeaderBar';
import { PlaygroundForm } from './components/PlaygroundForm';
import { InspectorPanel } from './components/inspector/InspectorPanel';
import { GuideBubble } from '../framework/components/GuideBubble';
import { NativeSpotlight } from '../framework/components/NativeSpotlight';
import { useGuideStore } from '../framework/store/guideStore';
import { initMascots } from '../mascots/initMascots';
import { initTours } from '../framework/tours/initTours';
import { validationRegistry } from '../framework/registries/validationRegistry';
import { DEFAULT_GUIDE_CONFIG } from './config/defaultSchema';

export const StudioApp: React.FC = () => {
  const { initialize, config } = useGuideStore();

  useEffect(() => {
    // 1. Initialize Pluggable Registries
    initMascots();
    initTours();

    // 2. Register Built-in Sample Custom Validator
    validationRegistry.register('vip_token_validator', (val) => {
      return typeof val === 'string' && val.startsWith('VIP-');
    });

    // 3. Initialize Default Schema
    if (!config) {
      initialize(DEFAULT_GUIDE_CONFIG);
    }
  }, [initialize, config]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-lime-500 selection:text-slate-950">
      {/* Background Decorative Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-lime-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      {/* Top Header Bar */}
      <HeaderBar />

      {/* Pluggable Native SVG Spotlight Overlay */}
      <NativeSpotlight />

      {/* Main Studio Workspace Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10 items-start">
        {/* Left Column: Live Companion & Interactive Sandbox */}
        <div className="lg:col-span-6 space-y-6">
          {/* Guide Mascot Bubble (docked preview) */}
          <GuideBubble className="w-full" />

          {/* Interactive Form Component */}
          <PlaygroundForm />
        </div>

        {/* Right Column: Framework Pipeline Inspector */}
        <div className="lg:col-span-6 sticky top-20">
          <InspectorPanel />
        </div>
      </main>

      {/* Global Architectural Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/90 py-5 px-6 text-center text-xs text-slate-500 relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3 max-w-7xl w-full mx-auto">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
          <span>Single-Source-of-Truth (SSOT) Reactive Engine</span>
        </div>
        <div>Zero-AI LLM Latency • 100% Client-Side Procedural Vector Mascots</div>
      </footer>
    </div>
  );
};
