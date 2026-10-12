import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { GuidedField } from '../../framework/components/GuidedField';
import { useGuideStore } from '../../framework/store/guideStore';
import { synthAudio } from '../../framework/audio/synthAudio';

export const PlaygroundForm: React.FC = () => {
  const { validateAll, soundEnabled } = useGuideStore();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = validateAll();
    if (isValid) {
      setSubmitted(true);
      if (soundEnabled) {
        synthAudio.playSuccess();
      }
    } else {
      setSubmitted(false);
      if (soundEnabled) {
        synthAudio.playError();
      }
    }
  };

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-md">
      {/* Decorative Top Accent Glow */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-lime-500 via-emerald-400 to-cyan-500" />

      {/* Header */}
      <div className="mb-6 pb-4 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-lime-400" /> Agency Early Access Registration
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Interact with the fields below to experience metadata-driven mascot assistance in real-time.
          </p>
        </div>
        <span className="text-[10px] font-semibold uppercase px-2.5 py-1 rounded-full bg-slate-800 text-lime-400 border border-lime-500/30">
          Live Client App
        </span>
      </div>

      {submitted && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/60 text-emerald-200 text-xs flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <div className="font-bold text-emerald-300">Registration Complete!</div>
            <p className="text-[11px] text-emerald-400/90 mt-0.5">
              All validations passed seamlessly without server roundtrips or LLM latency.
            </p>
          </div>
        </div>
      )}

      {/* Interactive Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <GuidedField componentId="full-name" />
        <GuidedField componentId="work-email" type="email" />
        <GuidedField
          componentId="company-size"
          type="select"
          options={[
            { value: '1-5', label: '1 - 5 Team Members (Solo / Boutique)' },
            { value: '6-25', label: '6 - 25 Team Members (Growth Stage)' },
            { value: '26-100', label: '26 - 100 Team Members (Scaleup)' },
            { value: '100+', label: '100+ Team Members (Enterprise Global)' },
          ]}
        />
        <GuidedField componentId="vip-token" />

        <div className="pt-3">
          <button
            type="submit"
            className="w-full py-3.5 px-5 rounded-2xl font-bold text-xs bg-gradient-to-r from-lime-500 via-lime-400 to-emerald-400 text-slate-950 hover:from-lime-400 hover:to-emerald-300 shadow-lg shadow-lime-500/25 transition-all flex items-center justify-center gap-2 group cursor-pointer active:scale-[0.99]"
          >
            Submit Access Request
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </form>
    </div>
  );
};
