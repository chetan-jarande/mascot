import React, { useState, useEffect } from 'react';
import { useGuideStore } from '../store/guideStore';

export const NativeSpotlight: React.FC = () => {
  const { tourActive, tourProviderId, activeComponentId } = useGuideStore();
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (!tourActive || tourProviderId !== 'native' || !activeComponentId) {
      setTargetRect(null);
      return;
    }

    const updateRect = () => {
      const el = document.querySelector(`[data-guide-id="${activeComponentId}"]`);
      if (el) {
        setTargetRect(el.getBoundingClientRect());
      } else {
        setTargetRect(null);
      }
    };

    updateRect();
    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect, true);

    return () => {
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect, true);
    };
  }, [tourActive, tourProviderId, activeComponentId]);

  if (!tourActive || tourProviderId !== 'native' || !targetRect) {
    return null;
  }

  const padding = 8;
  const x = Math.max(0, targetRect.left - padding);
  const y = Math.max(0, targetRect.top - padding);
  const width = targetRect.width + padding * 2;
  const height = targetRect.height + padding * 2;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-40 transition-opacity duration-300"
      data-testid="native-spotlight"
    >
      <svg className="w-full h-full">
        <defs>
          <mask id="spotlightMask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            <rect
              x={x}
              y={y}
              width={width}
              height={height}
              rx="12"
              fill="black"
            />
          </mask>
        </defs>

        {/* Dark Dimmer Backdrop with Cutout */}
        <rect
          x="0"
          y="0"
          width="100%" height="100%"
          fill="rgba(2, 6, 23, 0.75)"
          mask="url(#spotlightMask)"
        />

        {/* Pulsing Highlight Ring around Focused Element */}
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          rx="12"
          fill="none"
          stroke="#84CC16"
          strokeWidth="2.5"
          className="animate-pulse"
        />
      </svg>
    </div>
  );
};
