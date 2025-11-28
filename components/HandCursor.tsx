import React, { useEffect, useRef } from 'react';

interface HandCursorProps {
  isSlapping: boolean;
}

const HandCursor: React.FC<HandCursorProps> = ({ isSlapping }) => {
  const cursorRef = useRef<HTMLDivElement>(null);
  
  // Logic state in refs for performance
  const state = useRef({
    x: -100,
    y: -100,
    rotation: 0,
    targetRotation: 0,
    lastMouseX: 0
  });

  // Track isSlapping in a ref for the animation loop
  const isSlappingRef = useRef(isSlapping);
  useEffect(() => {
    isSlappingRef.current = isSlapping;
  }, [isSlapping]);

  useEffect(() => {
    let rAFId: number;

    const onMouseMove = (e: MouseEvent) => {
      const s = state.current;
      const dx = e.clientX - s.lastMouseX;
      s.lastMouseX = e.clientX;
      s.x = e.clientX;
      s.y = e.clientY;
      s.targetRotation = Math.max(-25, Math.min(25, dx * 0.8));
    };

    const loop = () => {
      const s = state.current;
      if (cursorRef.current) {
        // Smooth rotation
        s.rotation += (s.targetRotation - s.rotation) * 0.15;
        s.targetRotation *= 0.8;

        const scale = isSlappingRef.current ? 0.8 : 1;
        
        // Direct transform update
        cursorRef.current.style.transform = `translate3d(${s.x}px, ${s.y}px, 0) translate(-45%, -40%) rotate(${s.rotation}deg) scale(${scale})`;
      }
      rAFId = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', onMouseMove);
    rAFId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(rAFId);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed pointer-events-none z-[100] will-change-transform top-0 left-0"
      style={{ transform: 'translate3d(-100px, -100px, 0)' }}
    >
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="cute-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="#000" floodOpacity="0.15"/>
          </filter>
        </defs>

        <g filter="url(#cute-shadow)">
          {isSlapping ? (
            // SLAPPING: Tighter closed fist, fingers compressed
            <g>
               {/* Main fist shape */}
               <path 
                d="M45 85
                   C 40 80, 40 60, 45 50
                   C 50 40, 80 40, 85 50
                   C 95 60, 95 80, 85 90
                   C 75 98, 55 95, 45 85 Z"
                fill="#FDE047" 
                stroke="#D97706" 
                strokeWidth="4" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              {/* Knuckle lines */}
              <path d="M58 52 L 58 85" stroke="#D97706" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
              <path d="M72 52 L 72 85" stroke="#D97706" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
              {/* Thumb tucked in */}
              <path d="M40 70 Q 50 75, 55 65" stroke="#D97706" strokeWidth="4" strokeLinecap="round" fill="none" />
            </g>
          ) : (
            // IDLE: Open hand
            <g>
              <path 
                d="M30 75
                   C 25 65, 30 50, 40 55
                   L 42 30 C 40 15, 52 15, 54 30
                   L 56 50
                   L 58 15 C 58 2, 72 2, 72 15
                   L 74 50
                   L 82 20 C 84 8, 96 8, 94 20
                   L 86 55
                   L 98 45 C 108 40, 112 55, 102 65
                   L 85 85
                   C 75 105, 45 105, 40 95
                   C 35 90, 35 80, 30 75 Z"
                fill="#FDE047" 
                stroke="#D97706" 
                strokeWidth="4" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              {/* Palm detail */}
              <path 
                d="M50 85 Q 60 95, 70 85" 
                stroke="#D97706" 
                strokeWidth="3" 
                strokeLinecap="round" 
                opacity="0.4"
              />
            </g>
          )}
        </g>
      </svg>
    </div>
  );
};

export default HandCursor;