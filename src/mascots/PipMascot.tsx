import React, { useState, useEffect, useRef, useId } from 'react';
import type { MascotRendererProps, MascotExpression } from './types';

interface PipColors {
  body: string;
  belly: string;
  lens: string;
  beak: string;
  glow: string;
}

const getPipColors = (expression: MascotExpression): PipColors => {
  switch (expression) {
    case 'error':
      return {
        body: '#7F1D1D',
        belly: '#FCA5A5',
        lens: '#EF4444',
        beak: '#F97316',
        glow: 'rgba(239, 68, 68, 0.45)',
      };
    case 'happy':
      return {
        body: '#065F46',
        belly: '#A7F3D0',
        lens: '#10B981',
        beak: '#F59E0B',
        glow: 'rgba(16, 185, 129, 0.45)',
      };
    case 'celebrating':
      return {
        body: '#78350F',
        belly: '#FDE68A',
        lens: '#F59E0B',
        beak: '#EA580C',
        glow: 'rgba(245, 158, 11, 0.5)',
      };
    case 'thinking':
      return {
        body: '#4C1D95',
        belly: '#DDD6FE',
        lens: '#8B5CF6',
        beak: '#F59E0B',
        glow: 'rgba(139, 92, 246, 0.45)',
      };
    case 'surprised':
      return {
        body: '#9A3412',
        belly: '#FED7AA',
        lens: '#FB923C',
        beak: '#E11D48',
        glow: 'rgba(251, 146, 60, 0.45)',
      };
    case 'guiding':
      return {
        body: '#164E63',
        belly: '#CFFAFE',
        lens: '#06B6D4',
        beak: '#F59E0B',
        glow: 'rgba(6, 182, 212, 0.45)',
      };
    case 'neutral':
    default:
      return {
        body: '#312E81',
        belly: '#E0E7FF',
        lens: '#6366F1',
        beak: '#F59E0B',
        glow: 'rgba(99, 102, 241, 0.45)',
      };
  }
};

export const PipMascot: React.FC<MascotRendererProps> = ({
  expression,
  isTalking = false,
  size = 110,
  className = '',
}) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const gradId = useId();

  useEffect(() => {
    let rafId: number | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = null;
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
        const dist = Math.min(6, Math.hypot(e.clientX - centerX, e.clientY - centerY) / 30);

        setMousePos({
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist,
        });
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId !== null) window.cancelAnimationFrame(rafId);
    };
  }, []);

  const colors = getPipColors(expression);

  return (
    <div
      ref={containerRef}
      className={`relative flex items-center justify-center transition-transform duration-300 transform hover:scale-105 ${className}`}
      style={{ width: size, height: size }}
      data-testid="pip-mascot"
    >
      {/* Outer Pulse Glow */}
      <div
        className="absolute inset-0 rounded-full blur-xl transition-all duration-500 opacity-60 animate-pulse-slow"
        style={{ backgroundColor: colors.glow }}
      />

      <svg className="w-full h-full relative z-10 drop-shadow-2xl" viewBox="0 0 120 120">
        <defs>
          <radialGradient id={gradId} cx="35%" cy="35%" r="70%">
            <stop offset="0%" stopColor="#818CF8" stopOpacity="0.6" />
            <stop offset="60%" stopColor={colors.body} />
            <stop offset="100%" stopColor="#0F172A" />
          </radialGradient>
        </defs>

        {/* Ear Tufts / Horn Feathers */}
        <polygon points="32,24 24,12 40,20" fill={colors.body} />
        <polygon points="88,24 96,12 80,20" fill={colors.body} />

        {/* Owl Body Egg Contour */}
        <ellipse cx="60" cy="65" rx="42" ry="46" fill={`url(#${gradId})`} />

        {/* Belly Plume */}
        <ellipse cx="60" cy="74" rx="26" ry="28" fill={colors.belly} opacity="0.9" />

        {/* Feather Chevron Pattern on Belly */}
        <path d="M 52,66 Q 60,70 68,66" fill="none" stroke={colors.body} strokeWidth="2" strokeLinecap="round" />
        <path d="M 50,76 Q 60,80 70,76" fill="none" stroke={colors.body} strokeWidth="2" strokeLinecap="round" />
        <path d="M 54,86 Q 60,89 66,86" fill="none" stroke={colors.body} strokeWidth="2" strokeLinecap="round" />

        {/* Eyeglass Frames with Adjusted Centers & Radius to Prevent Overlap */}
        <circle cx="45" cy="48" r="14" fill="#1E1B4B" stroke="#FDE047" strokeWidth="2.5" />
        <circle cx="75" cy="48" r="14" fill="#1E1B4B" stroke="#FDE047" strokeWidth="2.5" />
        {/* Bridge cleanly between 59 and 61 */}
        <path d="M 59,48 Q 60,45 61,48" stroke="#FDE047" strokeWidth="2.5" fill="none" />

        {/* Big Inquisitive Eyes & Pupils with Mouse Tracking */}
        <g
          transform={`translate(${mousePos.x}, ${mousePos.y})`}
          className="transition-transform duration-75 ease-out"
        >
          {expression === 'error' ? (
            /* Angled Worried Lenses */
            <>
              <line x1="38" y1="42" x2="52" y2="54" stroke={colors.lens} strokeWidth="3.5" strokeLinecap="round" />
              <line x1="52" y1="42" x2="38" y2="54" stroke={colors.lens} strokeWidth="3.5" strokeLinecap="round" />
              <line x1="68" y1="42" x2="82" y2="54" stroke={colors.lens} strokeWidth="3.5" strokeLinecap="round" />
              <line x1="82" y1="42" x2="68" y2="54" stroke={colors.lens} strokeWidth="3.5" strokeLinecap="round" />
            </>
          ) : expression === 'happy' || expression === 'celebrating' ? (
            /* Cheerful Arcs ^ ^ */
            <>
              <path d="M 38,50 Q 45,41 52,50" fill="none" stroke="#FACC15" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M 68,50 Q 75,41 82,50" fill="none" stroke="#FACC15" strokeWidth="3.5" strokeLinecap="round" />
            </>
          ) : expression === 'surprised' ? (
            /* Wide Dilated Golden Eyes */
            <>
              <circle cx="45" cy="48" r="9" fill="#FACC15" />
              <circle cx="45" cy="48" r="4.5" fill="#0F172A" />
              <circle cx="75" cy="48" r="9" fill="#FACC15" />
              <circle cx="75" cy="48" r="4.5" fill="#0F172A" />
            </>
          ) : (
            /* Wise Owl Glass Lens Pupils */
            <>
              <circle cx="45" cy="48" r="8" fill="#FDE047" />
              <circle cx="45" cy="48" r="4.5" fill="#0F172A" />
              <circle cx="43" cy="45" r="1.8" fill="#FFFFFF" />
              <circle cx="75" cy="48" r="8" fill="#FDE047" />
              <circle cx="75" cy="48" r="4.5" fill="#0F172A" />
              <circle cx="73" cy="45" r="1.8" fill="#FFFFFF" />
            </>
          )}
        </g>

        {/* Golden Beak Anchored Centrally to Face */}
        <polygon
          points={
            isTalking
              ? '55,56 65,56 60,68'
              : expression === 'error'
              ? '56,58 64,58 60,65'
              : '55,56 65,56 60,65'
          }
          fill={colors.beak}
          stroke="#B45309"
          strokeWidth="1"
        />

        {/* Small Talons */}
        <ellipse cx="48" cy="107" rx="6" ry="3" fill="#D97706" />
        <ellipse cx="72" cy="107" rx="6" ry="3" fill="#D97706" />
      </svg>
    </div>
  );
};
