import React, { useState, useEffect, useRef, useId } from 'react';
import type { MascotRendererProps, MascotExpression } from './types';

interface ByteColors {
  chassis: string;
  screen: string;
  led: string;
  glow: string;
  accent: string;
}

const getByteColors = (expression: MascotExpression): ByteColors => {
  switch (expression) {
    case 'error':
      return {
        chassis: '#1E293B',
        screen: '#020617',
        led: '#EF4444',
        glow: 'rgba(239, 68, 68, 0.5)',
        accent: '#DC2626',
      };
    case 'happy':
      return {
        chassis: '#1E293B',
        screen: '#020617',
        led: '#10B981',
        glow: 'rgba(16, 185, 129, 0.5)',
        accent: '#059669',
      };
    case 'celebrating':
      return {
        chassis: '#1E293B',
        screen: '#020617',
        led: '#F59E0B',
        glow: 'rgba(245, 158, 11, 0.55)',
        accent: '#D97706',
      };
    case 'thinking':
      return {
        chassis: '#1E293B',
        screen: '#020617',
        led: '#A855F7',
        glow: 'rgba(168, 85, 247, 0.5)',
        accent: '#7E22CE',
      };
    case 'surprised':
      return {
        chassis: '#1E293B',
        screen: '#020617',
        led: '#F97316',
        glow: 'rgba(249, 115, 22, 0.5)',
        accent: '#EA580C',
      };
    case 'guiding':
      return {
        chassis: '#1E293B',
        screen: '#020617',
        led: '#06B6D4',
        glow: 'rgba(6, 182, 212, 0.5)',
        accent: '#0891B2',
      };
    case 'neutral':
    default:
      return {
        chassis: '#1E293B',
        screen: '#020617',
        led: '#22D3EE',
        glow: 'rgba(34, 211, 238, 0.45)',
        accent: '#06B6D4',
      };
  }
};

export const ByteMascot: React.FC<MascotRendererProps> = ({
  expression,
  isTalking = false,
  size = 110,
  className = '',
}) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const gradId = useId();
  const patternId = useId();

  useEffect(() => {
    let rafId: number | null = null;
    let latestE: MouseEvent | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      latestE = e;
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = null;
        if (!containerRef.current || !latestE) return;
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const angle = Math.atan2(latestE.clientY - centerY, latestE.clientX - centerX);
        const dist = Math.min(5, Math.hypot(latestE.clientX - centerX, latestE.clientY - centerY) / 32);

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

  const colors = getByteColors(expression);

  return (
    <div
      ref={containerRef}
      className={`relative flex items-center justify-center transition-transform duration-300 transform hover:scale-105 ${className}`}
      style={{ width: size, height: size }}
      data-testid="byte-mascot"
    >
      {/* Outer Pulse Glow */}
      <div
        className="absolute inset-0 rounded-2xl blur-xl transition-all duration-500 opacity-60 animate-pulse-slow"
        style={{ backgroundColor: colors.glow }}
      />

      <svg className="w-full h-full relative z-10 drop-shadow-2xl" viewBox="0 0 120 120">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>
          <pattern id={patternId} width="100" height="4" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="100" y2="0" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          </pattern>
        </defs>

        {/* Dual Antenna Rods */}
        <line x1="38" y1="28" x2="28" y2="14" stroke="#64748B" strokeWidth="3" strokeLinecap="round" />
        <circle cx="28" cy="14" r="4" fill={colors.accent} />

        <line x1="82" y1="28" x2="92" y2="14" stroke="#64748B" strokeWidth="3" strokeLinecap="round" />
        <circle cx="92" cy="14" r="4" fill={colors.accent} />

        {/* Outer Robot Head Chassis */}
        <rect
          x="20"
          y="28"
          width="80"
          height="70"
          rx="14"
          fill={`url(#${gradId})`}
          stroke="#475569"
          strokeWidth="2.5"
        />

        {/* Metal Ears */}
        <rect x="14" y="52" width="6" height="22" rx="3" fill="#64748B" />
        <rect x="100" y="52" width="6" height="22" rx="3" fill="#64748B" />

        {/* CRT Bezel Screen */}
        <rect
          x="28"
          y="36"
          width="64"
          height="52"
          rx="8"
          fill={colors.screen}
          stroke="#334155"
          strokeWidth="1.5"
        />
        {/* Scanline Overlay */}
        <rect x="28" y="36" width="64" height="52" rx="8" fill={`url(#${patternId})`} />

        {/* Digital Matrix Eyes with Mouse Tracking */}
        <g
          transform={`translate(${mousePos.x}, ${mousePos.y})`}
          className="transition-transform duration-75 ease-out"
        >
          {expression === 'error' ? (
            /* Red Matrix Crosses */
            <>
              <line x1="40" y1="48" x2="52" y2="60" stroke={colors.led} strokeWidth="3.5" strokeLinecap="square" />
              <line x1="52" y1="48" x2="40" y2="60" stroke={colors.led} strokeWidth="3.5" strokeLinecap="square" />
              <line x1="68" y1="48" x2="80" y2="60" stroke={colors.led} strokeWidth="3.5" strokeLinecap="square" />
              <line x1="80" y1="48" x2="68" y2="60" stroke={colors.led} strokeWidth="3.5" strokeLinecap="square" />
            </>
          ) : expression === 'happy' || expression === 'celebrating' ? (
            /* Digital Chevrons ^ ^ */
            <>
              <polyline points="40,58 46,50 52,58" fill="none" stroke={colors.led} strokeWidth="3.5" strokeLinecap="round" />
              <polyline points="68,58 74,50 80,58" fill="none" stroke={colors.led} strokeWidth="3.5" strokeLinecap="round" />
            </>
          ) : expression === 'surprised' ? (
            /* Square Matrix [ ] */
            <>
              <rect x="40" y="48" width="12" height="12" fill="none" stroke={colors.led} strokeWidth="3" />
              <rect x="68" y="48" width="12" height="12" fill="none" stroke={colors.led} strokeWidth="3" />
            </>
          ) : expression === 'thinking' ? (
            /* Scrolling Dots */
            <>
              <circle cx="43" cy="54" r="3" fill={colors.led} />
              <circle cx="51" cy="54" r="3" fill={colors.led} />
              <circle cx="71" cy="54" r="3" fill={colors.led} />
              <circle cx="79" cy="54" r="3" fill={colors.led} />
            </>
          ) : expression === 'guiding' ? (
            /* Arrow Matrix >> */
            <>
              <polyline points="42,48 48,54 42,60" fill="none" stroke={colors.led} strokeWidth="3" />
              <polyline points="70,48 76,54 70,60" fill="none" stroke={colors.led} strokeWidth="3" />
            </>
          ) : (
            /* Default Dual LED Rectangles */
            <>
              <rect x="41" y="50" width="11" height="8" rx="2" fill={colors.led} />
              <rect x="68" y="50" width="11" height="8" rx="2" fill={colors.led} />
            </>
          )}

          {/* Matrix Mouth / Audio Equalizer Bar with isTalking Support */}
          {isTalking ? (
            <g fill={colors.led}>
              <rect x="44" y="73" width="6" height="6" rx="1" />
              <rect x="52" y="71" width="6" height="10" rx="1" />
              <rect x="60" y="69" width="6" height="14" rx="1" />
              <rect x="68" y="71" width="6" height="10" rx="1" />
            </g>
          ) : expression === 'happy' || expression === 'celebrating' ? (
            <line x1="46" y1="74" x2="74" y2="74" stroke={colors.led} strokeWidth="3" strokeLinecap="round" />
          ) : expression === 'error' ? (
            <line x1="46" y1="76" x2="74" y2="74" stroke={colors.led} strokeWidth="3" strokeLinecap="round" />
          ) : (
            <line x1="48" y1="74" x2="72" y2="74" stroke={colors.led} strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
          )}
        </g>
      </svg>
    </div>
  );
};
