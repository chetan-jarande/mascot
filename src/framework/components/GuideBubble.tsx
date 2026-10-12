import React, { useState, useEffect } from 'react';
import { useFloating, autoUpdate, offset, flip, shift } from '@floating-ui/react';
import { Sparkles, ChevronRight, ChevronLeft, Bot } from 'lucide-react';
import { useGuideStore } from '../store/guideStore';
import { mascotRegistry } from '../registries/mascotRegistry';
import { synthAudio } from '../audio/synthAudio';

export interface GuideBubbleProps {
  floating?: boolean;
  className?: string;
}

export const GuideBubble: React.FC<GuideBubbleProps> = ({
  floating = false,
  className = '',
}) => {
  const {
    currentMessage,
    currentExpression,
    activeMascotId,
    activeComponentId,
    tourActive,
    tourStep,
    nextTourStep,
    prevTourStep,
    endTour,
    soundEnabled,
  } = useGuideStore();

  const [displayedText, setDisplayedText] = useState('');
  const [referenceEl, setReferenceEl] = useState<HTMLElement | null>(null);

  // Look for target element in DOM when activeComponentId changes
  useEffect(() => {
    if (!floating) {
      setReferenceEl(null);
      return;
    }

    if (activeComponentId) {
      const el = document.querySelector(`[data-guide-id="${activeComponentId}"]`) as HTMLElement;
      setReferenceEl(el || null);
    } else {
      setReferenceEl(null);
    }
  }, [activeComponentId, floating]);

  const { refs, floatingStyles, placement } = useFloating({
    elements: {
      reference: referenceEl,
    },
    whileElementsMounted: autoUpdate,
    placement: 'bottom-start',
    middleware: [
      offset(14),
      flip({ fallbackPlacements: ['top-start', 'right-start', 'left-start'] }),
      shift({ padding: 12 }),
    ],
  });

  // Typewriter effect
  useEffect(() => {
    let index = 0;
    setDisplayedText('');

    if (soundEnabled && currentMessage.length > 0) {
      synthAudio.playFocus();
    }

    const timer = setInterval(() => {
      if (index < currentMessage.length) {
        setDisplayedText((prev) => prev + currentMessage.charAt(index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 14);

    return () => clearInterval(timer);
  }, [currentMessage, soundEnabled]);

  const mascotDef = mascotRegistry.get(activeMascotId) || mascotRegistry.get('nova');
  const MascotComponent = mascotDef?.component;

  const content = (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="flex items-start gap-4 p-5 rounded-3xl bg-slate-900/90 border border-slate-700/80 shadow-2xl backdrop-blur-md max-w-lg w-full transition-all duration-300"
      data-testid="guide-bubble"
    >
      {/* Mascot Avatar Container */}
      <div className="shrink-0 flex flex-col items-center">
        {MascotComponent ? (
          <MascotComponent expression={currentExpression} size={90} />
        ) : (
          <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
            <Bot className="w-8 h-8" />
          </div>
        )}
        <div className="mt-1 flex items-center gap-1">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-lime-500/20 text-lime-400 border border-lime-500/30">
            {currentExpression}
          </span>
        </div>
      </div>

      {/* Speech Content Bubble */}
      <div className="flex-1 flex flex-col justify-between min-h-[96px]">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-lime-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-lime-400" />
              {mascotDef ? mascotDef.name : 'Nova'} Guide
            </span>
            {activeComponentId && (
              <span className="text-[10px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700 font-mono">
                #{activeComponentId}
              </span>
            )}
          </div>
          <p className="text-xs leading-relaxed font-medium text-slate-200">
            {displayedText}
            <span className="inline-block w-1.5 h-3.5 bg-lime-400 ml-1 animate-pulse align-middle" />
          </p>
        </div>

        {/* Tour Navigation Controls (visible when tour is running) */}
        {tourActive && (
          <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-slate-400">
                Tour Step {tourStep}
              </span>
              <button
                onClick={() => endTour()}
                className="text-[10px] text-slate-500 hover:text-slate-300 transition-colors"
                title="Exit Tour"
              >
                (Exit)
              </button>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => prevTourStep()}
                className="p-1 hover:bg-slate-800 rounded-lg text-slate-300 transition-colors"
                title="Previous step"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => nextTourStep()}
                className="px-2 py-1 bg-lime-500 text-slate-950 font-bold rounded-lg text-[11px] hover:bg-lime-400 transition-all flex items-center gap-1 shadow-md shadow-lime-500/20"
                title="Next step"
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (floating && referenceEl) {
    return (
      <div
        ref={refs.setFloating}
        style={floatingStyles}
        className={`z-50 pointer-events-auto ${className}`}
        data-placement={placement}
      >
        {content}
      </div>
    );
  }

  return <div className={`relative ${className}`}>{content}</div>;
};
