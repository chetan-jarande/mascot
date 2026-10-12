import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, ChevronRight, ChevronLeft, X, Bot, HelpCircle } from 'lucide-react';
import { useGuideStore } from '../store/guideStore';
import { mascotRegistry } from '../registries/mascotRegistry';
import { synthAudio } from '../audio/synthAudio';

interface Position {
  x: number;
  y: number;
}

export const FloatingMascotCompanion: React.FC = () => {
  const {
    activeComponentId,
    currentMessage,
    currentExpression,
    activeMascotId,
    tourActive,
    tourStep,
    nextTourStep,
    prevTourStep,
    endTour,
    soundEnabled,
    triggerExpression,
  } = useGuideStore();

  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [isPerched, setIsPerched] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);
  const [bubbleOpen, setBubbleOpen] = useState(true);
  const [typewriterText, setTypewriterText] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  const prevComponentRef = useRef<string | null>(null);

  // Calculate position: perching beside active element or resting at bottom-right dock
  useEffect(() => {
    const updatePosition = () => {
      if (typeof window === 'undefined') return;

      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      if (activeComponentId) {
        const targetEl = document.querySelector(`[data-guide-id="${activeComponentId}"]`);
        if (targetEl) {
          const rect = targetEl.getBoundingClientRect();
          let targetX = rect.right + 24;
          let targetY = rect.top + rect.height / 2 - 45;

          // If too far right, place on left side of element
          if (targetX + 320 > windowWidth) {
            targetX = Math.max(16, rect.left - 340);
          }

          // Keep within vertical viewport bounds
          targetY = Math.max(80, Math.min(targetY, windowHeight - 220));

          setPosition({ x: targetX, y: targetY });
          setIsPerched(true);

          if (prevComponentRef.current !== activeComponentId) {
            setShowSparkles(true);
            setTimeout(() => setShowSparkles(false), 900);
            if (soundEnabled) {
              synthAudio.playFocus();
            }
          }
          prevComponentRef.current = activeComponentId;
          return;
        }
      }

      // Default resting dock position (bottom-right)
      const dockX = Math.max(20, windowWidth - 360);
      const dockY = Math.max(80, windowHeight - 200);

      setPosition({ x: dockX, y: dockY });
      setIsPerched(false);
      prevComponentRef.current = null;
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [activeComponentId, soundEnabled]);

  // Typewriter animation
  useEffect(() => {
    let index = 0;
    setTypewriterText('');
    setBubbleOpen(true);

    const timer = setInterval(() => {
      if (index < currentMessage.length) {
        setTypewriterText((prev) => prev + currentMessage.charAt(index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 14);

    return () => clearInterval(timer);
  }, [currentMessage]);

  const mascotDef = mascotRegistry.get(activeMascotId) || mascotRegistry.get('nova');
  const MascotComponent = mascotDef?.component;

  const handleMascotClick = () => {
    if (tourActive) {
      nextTourStep();
      if (soundEnabled) synthAudio.playSuccess();
    } else {
      triggerExpression('happy', 'Hey there! Click any field or take the tour to let me guide you! ✨');
      if (soundEnabled) synthAudio.playSuccess();
    }
  };

  return (
    <aside
      role="complementary"
      aria-label="Floating Mascot Companion"
      className="fixed z-50 pointer-events-none transition-all duration-700 ease-out select-none"
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        transitionTimingFunction: 'cubic-bezier(0.34, 1.25, 0.64, 1)',
      }}
      data-testid="floating-mascot-companion"
    >
      <div className="relative flex items-center gap-3">
        {/* Mascot Avatar with Interactive Click and Floating Bobbing Physics */}
        <div
          onClick={handleMascotClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`pointer-events-auto cursor-pointer relative group transition-transform duration-300 ${
            isHovered ? 'scale-110' : ''
          } ${!isPerched ? 'animate-bounce-subtle' : ''}`}
          title={tourActive ? 'Click mascot to advance tour step!' : 'Click mascot for companion tip!'}
        >
          {MascotComponent ? (
            <MascotComponent expression={currentExpression} size={isPerched ? 88 : 96} />
          ) : (
            <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
              <Bot className="w-8 h-8" />
            </div>
          )}

          {/* Magical Arrival Particle Burst */}
          {showSparkles && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="absolute -top-3 -left-3 animate-ping">
                <Sparkles className="w-5 h-5 text-yellow-300" />
              </div>
              <div className="absolute -top-4 right-0 animate-bounce">
                <Sparkles className="w-4 h-4 text-lime-400" />
              </div>
              <div className="absolute -bottom-2 -left-2 animate-pulse">
                <Sparkles className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
          )}

          {/* Quick Hover / Tour Step Hint Badge */}
          <div className="absolute -bottom-2 inset-x-0 flex justify-center">
            <span className="text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-950/90 text-lime-400 border border-lime-500/40 shadow-lg backdrop-blur-sm">
              {tourActive ? `Step ${tourStep}` : mascotDef?.name || 'Nova'}
            </span>
          </div>
        </div>

        {/* Floating Conversational Speech Bubble */}
        {bubbleOpen && (
          <div
            role="status"
            aria-live="polite"
            className="pointer-events-auto max-w-xs w-72 p-4 rounded-2xl bg-slate-900/95 border border-slate-700/80 shadow-2xl backdrop-blur-xl text-xs flex flex-col justify-between transition-all duration-300 animate-fadeIn"
          >
            {/* Header info bar */}
            <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-800 text-[10px]">
              <div className="flex items-center gap-1 text-lime-400 font-bold">
                <Sparkles className="w-3 h-3 text-lime-400" />
                {mascotDef?.name} Assistant
              </div>
              <div className="flex items-center gap-1">
                {activeComponentId && (
                  <span className="font-mono text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                    #{activeComponentId}
                  </span>
                )}
                <button
                  onClick={() => setBubbleOpen(false)}
                  className="p-0.5 text-slate-500 hover:text-slate-300 rounded transition-colors"
                  title="Minimize Bubble"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Conversational Text Content */}
            <p className="text-slate-200 text-xs leading-relaxed font-medium min-h-[38px]">
              {typewriterText}
              <span className="inline-block w-1.5 h-3 bg-lime-400 ml-1 animate-pulse align-middle" />
            </p>

            {/* Tour Action Controls when Tour is Running */}
            {tourActive && (
              <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                <button
                  onClick={() => endTour()}
                  className="text-slate-500 hover:text-slate-300 transition-colors text-[10px]"
                >
                  Exit Tour
                </button>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => prevTourStep()}
                    className="p-1 hover:bg-slate-800 rounded text-slate-300"
                    title="Previous Step"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => nextTourStep()}
                    className="px-2.5 py-1 bg-lime-500 hover:bg-lime-400 text-slate-950 font-bold rounded-lg flex items-center gap-1 shadow-sm shadow-lime-500/20"
                  >
                    Next <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Minimized Pill to Re-open Bubble if Closed */}
        {!bubbleOpen && (
          <button
            onClick={() => setBubbleOpen(true)}
            className="pointer-events-auto p-2 rounded-full bg-slate-900 border border-slate-700 text-lime-400 shadow-xl hover:bg-slate-800 transition-colors"
            title="Open Speech Bubble"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        )}
      </div>
    </aside>
  );
};
