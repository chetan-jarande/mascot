import React, { useState, useEffect, useRef } from 'react';
import type { MascotRendererProps, MascotExpression } from './types';

interface AvatarColors {
  body: string;
  glow: string;
  accent: string;
}

const getColors = (expression: MascotExpression): AvatarColors => {
  switch (expression) {
    case 'error':
      return { body: '#EF4444', glow: 'rgba(239, 68, 68, 0.45)', accent: '#991B1B' };
    case 'happy':
      return { body: '#10B981', glow: 'rgba(16, 185, 129, 0.45)', accent: '#065F46' };
    case 'celebrating':
      return { body: '#F59E0B', glow: 'rgba(245, 158, 11, 0.55)', accent: '#B45309' };
    case 'surprised':
      return { body: '#F97316', glow: 'rgba(249, 115, 22, 0.45)', accent: '#C2410C' };
    case 'thinking':
      return { body: '#8B5CF6', glow: 'rgba(139, 92, 246, 0.45)', accent: '#5B21B6' };
    case 'guiding':
      return { body: '#06B6D4', glow: 'rgba(6, 182, 212, 0.45)', accent: '#0E7490' };
    case 'neutral':
    default:
      return { body: '#84CC16', glow: 'rgba(132, 204, 22, 0.45)', accent: '#3F6212' };
  }
};

export const NovaMascot: React.FC<MascotRendererProps> = ({
  expression,
  isTalking = false,
  size = 110,
  className = '',
}) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
      const dist = Math.min(7, Math.hypot(e.clientX - centerX, e.clientY - centerY) / 28);

      setMousePos({
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const colors = getColors(expression);

  return (
    <div
      ref={containerRef}
      className={`relative flex items-center justify-center transition-transform duration-300 transform hover:scale-105 ${className}`}
      style={{ width: size, height: size }}
      data-testid="nova-mascot"
    >
      {/* Outer Pulse Glow */}
      <div
        className="absolute inset-0 rounded-full blur-xl transition-all duration-500 opacity-70 animate-pulse-slow"
        style={{ backgroundColor: colors.glow }}
      />

      <svg className="w-full h-full relative z-10 drop-shadow-2xl" viewBox="0 0 120 120">
        <defs>
          <radialGradient id="novaBodyGrad" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.45" />
            <stop offset="50%" stopColor={colors.body} />
            <stop offset="100%" stopColor={colors.accent} />
          </radialGradient>
        </defs>

        {/* Antenna Stem */}
        <path
          d="M 60,35 Q 60,18 70,12"
          stroke={colors.accent}
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
        {/* Antenna Bulb */}
        <circle cx="70" cy="12" r="6" fill="#FACC15">
          <animate attributeName="r" values="5;7;5" dur="1.8s" repeatCount="indefinite" />
        </circle>

        {/* Main Blob Body */}
        <path
          d="M 60 25 C 90 25, 105 45, 105 70 C 105 95, 85 105, 60 105 C 35 105, 15 95, 15 70 C 15 45, 30 25, 60 25 Z"
          fill="url(#novaBodyGrad)"
          className="transition-all duration-300"
        />

        {/* Eyes & Pupil Group with Mouse Tracking */}
        <g
          transform={`translate(${mousePos.x}, ${mousePos.y})`}
          className="transition-transform duration-75 ease-out"
        >
          {expression === 'error' ? (
            /* Cross Eyes */
            <>
              <line x1="42" y1="52" x2="52" y2="62" stroke="#1E293B" strokeWidth="4.5" strokeLinecap="round" />
              <line x1="52" y1="52" x2="42" y2="62" stroke="#1E293B" strokeWidth="4.5" strokeLinecap="round" />
              <line x1="68" y1="52" x2="78" y2="62" stroke="#1E293B" strokeWidth="4.5" strokeLinecap="round" />
              <line x1="78" y1="52" x2="68" y2="62" stroke="#1E293B" strokeWidth="4.5" strokeLinecap="round" />
            </>
          ) : expression === 'happy' || expression === 'celebrating' ? (
            /* Joyful Arc Eyes */
            <>
              <path d="M 40 58 Q 47 48 54 58" fill="none" stroke="#064E3B" strokeWidth="4.5" strokeLinecap="round" />
              <path d="M 66 58 Q 73 48 80 58" fill="none" stroke="#064E3B" strokeWidth="4.5" strokeLinecap="round" />
            </>
          ) : expression === 'surprised' ? (
            /* Wide Surprised Eyes */
            <>
              <circle cx="47" cy="56" r="8" fill="#FFF" />
              <circle cx="47" cy="56" r="4" fill="#0F172A" />
              <circle cx="73" cy="56" r="8" fill="#FFF" />
              <circle cx="73" cy="56" r="4" fill="#0F172A" />
            </>
          ) : (
            /* Normal Oval Pupil Eyes */
            <>
              <ellipse cx="47" cy="56" rx="5" ry="7" fill="#0F172A" />
              <circle cx="45" cy="53" r="2" fill="#FFF" />
              <ellipse cx="73" cy="56" rx="5" ry="7" fill="#0F172A" />
              <circle cx="71" cy="53" r="2" fill="#FFF" />
            </>
          )}

          {/* Cheeks */}
          <ellipse cx="36" cy="66" rx="5" ry="3" fill="#F43F5E" opacity="0.45" />
          <ellipse cx="84" cy="66" rx="5" ry="3" fill="#F43F5E" opacity="0.45" />

          {/* Dynamic Mouth */}
          {expression === 'happy' || expression === 'celebrating' ? (
            <path
              d={isTalking ? 'M 48 70 Q 60 86 72 70 Z' : 'M 48 72 Q 60 84 72 72 Z'}
              fill="#064E3B"
            />
          ) : expression === 'error' ? (
            <path d="M 48 76 Q 60 68 72 76" fill="none" stroke="#7F1D1D" strokeWidth="3.5" strokeLinecap="round" />
          ) : expression === 'surprised' ? (
            <circle cx="60" cy="76" r="5" fill="#0F172A" />
          ) : expression === 'thinking' ? (
            <path d="M 52 75 Q 60 73 68 76" fill="none" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
          ) : (
            <path d="M 50 74 Q 60 78 70 74" fill="none" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
          )}
        </g>

        {/* Celebrating Sparkles */}
        {expression === 'celebrating' && (
          <g className="animate-spin" style={{ transformOrigin: '60px 60px', animationDuration: '6s' }}>
            <polygon points="25,20 27,24 31,25 27,26 25,30 23,26 19,25 23,24" fill="#FDE047" />
            <polygon points="95,20 97,24 101,25 97,26 95,30 93,26 89,25 93,24" fill="#FDE047" />
          </g>
        )}
      </svg>
    </div>
  );
};
