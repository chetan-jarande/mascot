import React, { useState } from 'react';
import { Send, Smile, Frown, HelpCircle, AlertOctagon, Sparkles, Navigation, Meh } from 'lucide-react';
import { useGuideStore } from '../../../framework/store/guideStore';
import type { MascotExpression } from '../../../framework/types/guide-framework';
import { synthAudio } from '../../../framework/audio/synthAudio';

export const EmotionSandboxTab: React.FC = () => {
  const { currentExpression, triggerExpression, soundEnabled } = useGuideStore();
  const [customMsg, setCustomMsg] = useState('');

  const emotions: { id: MascotExpression; label: string; icon: React.ReactNode; color: string }[] = [
    { id: 'neutral', label: 'Neutral', icon: <Meh className="w-3.5 h-3.5" />, color: 'bg-lime-500/10 text-lime-400 border-lime-500/30' },
    { id: 'happy', label: 'Happy', icon: <Smile className="w-3.5 h-3.5" />, color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
    { id: 'thinking', label: 'Thinking', icon: <HelpCircle className="w-3.5 h-3.5" />, color: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
    { id: 'error', label: 'Error', icon: <Frown className="w-3.5 h-3.5" />, color: 'bg-rose-500/10 text-rose-400 border-rose-500/30' },
    { id: 'surprised', label: 'Surprised', icon: <AlertOctagon className="w-3.5 h-3.5" />, color: 'bg-orange-500/10 text-orange-400 border-orange-500/30' },
    { id: 'guiding', label: 'Guiding', icon: <Navigation className="w-3.5 h-3.5" />, color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' },
    { id: 'celebrating', label: 'Celebrating', icon: <Sparkles className="w-3.5 h-3.5" />, color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
  ];

  const handleTrigger = (expr: MascotExpression) => {
    triggerExpression(expr, customMsg || undefined);
    if (soundEnabled) {
      if (expr === 'error') synthAudio.playError();
      else if (expr === 'happy' || expr === 'celebrating') synthAudio.playSuccess();
      else synthAudio.playFocus();
    }
  };

  const handleSpeak = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customMsg.trim()) return;
    triggerExpression(currentExpression, customMsg.trim());
    if (soundEnabled) synthAudio.playFocus();
  };

  return (
    <div className="flex-1 overflow-y-auto space-y-4 text-xs pr-1">
      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
        <div className="font-semibold text-slate-200 mb-2">Direct Facial Rigging Triggers</div>
        <div className="grid grid-cols-2 gap-2">
          {emotions.map((emo) => {
            const isSelected = currentExpression === emo.id;
            return (
              <button
                key={emo.id}
                onClick={() => handleTrigger(emo.id)}
                className={`p-2.5 rounded-xl border flex items-center justify-between font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'ring-2 ring-lime-400 scale-[1.02] shadow-lg ' + emo.color
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <span className="flex items-center gap-2">
                  {emo.icon}
                  {emo.label}
                </span>
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-ping" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
        <div className="font-semibold text-slate-200 mb-2">Speech Simulator</div>
        <form onSubmit={handleSpeak} className="space-y-2">
          <input
            type="text"
            placeholder="Type custom sentence for the mascot to say..."
            value={customMsg}
            onChange={(e) => setCustomMsg(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-lime-500"
          />
          <button
            type="submit"
            className="w-full py-2 bg-lime-500 hover:bg-lime-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" /> Speak as Active Mascot
          </button>
        </form>
      </div>
    </div>
  );
};
