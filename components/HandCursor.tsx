import React, { useEffect, useRef } from 'react';

interface HandCursorProps {
  isSlapping: boolean;
}

const HandCursor: React.FC<HandCursorProps> = ({ isSlapping }) => {
  const cursorRef = useRef<HTMLDivElement>(null);
  
  // We use refs to store mutable values without triggering re-renders
  const state = useRef({
    x: -100,
    y: -100,
    rotation: 0,
    targetRotation: 0,
    lastMouseX: 0
  });

  // Animation Loop: Decoupled from React state for maximum performance
  useEffect(() => {
    let rAFId: number;

    const onMouseMove = (e: MouseEvent) => {
      const s = state.current;
      const dx = e.clientX - s.lastMouseX;
      s.lastMouseX = e.clientX;
      s.x = e.clientX;
      s.y = e.clientY;
      
      // Calculate target rotation based on horizontal movement speed
      s.targetRotation = Math.max(-25, Math.min(25, dx * 0.8));
    };

    const loop = () => {
      const s = state.current;
      const el = cursorRef.current;

      if (el) {
        // Smoothly interpolate rotation (Linear Interpolation)
        s.rotation += (s.targetRotation - s.rotation) * 0.15;
        // Decay target rotation back to 0 when stopped
        s.targetRotation *= 0.8;

        // Apply transform directly to DOM node
        // NOTE: We access the fresh 'isSlapping' prop via the dependency array effect below, 
        // but for high-perf animation we mix refs and props carefully.
        // However, since isSlapping triggers a re-render, we can just rely on the parent 
        // passing the prop down to the style calculation or class.
        // To keep the loop simple, we will apply the transform here.
        
        // We read the scale from a data-attribute or just hardcode the logic here if we want absolute perf,
        // but since isSlapping changes rarely, we can let React handle the scale via style prop 
        // and let this loop handle X/Y/Rotation.
        
        // Actually, to avoid conflicts, let's handle ALL transform here.
        // We will store 'isSlapping' in the ref to access it in the loop without closure staleness.
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

  // Update ref when prop changes so the loop sees it immediately
  const isSlappingRef = useRef(isSlapping);
  useEffect(() => {
    isSlappingRef.current = isSlapping;
  }, [isSlapping]);

  // Secondary effect to sync the loop with the DOM for the transform
  useEffect(() => {
    let rAFId: number;
    const loop = () => {
      const s = state.current;
      if (cursorRef.current) {
        const scale = isSlappingRef.current ? 0.85 : 1;
        cursorRef.current.style.transform = `translate3d(${s.x}px, ${s.y}px, 0) translate(-45%, -40%) rotate(${s.rotation}deg) scale(${scale})`;
      }
      rAFId = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(rAFId);
  }, []); // Empty dependency: loop runs forever, reading from refs

  return (
    <div
      ref={cursorRef}
      className="fixed pointer-events-none z-[100] will-change-transform top-0 left-0"
      style={{
        // Initial hidden state until mouse moves
        transform: 'translate3d(-100px, -100px, 0)'
      }}
    >
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="cute-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="#000" floodOpacity="0.15"/>
          </filter>
        </defs>

        <g filter="url(#cute-shadow)">
          {isSlapping ? (
            // Slapping State: Closed Fist / Paw
            <g>
              <path 
                d="M40 85 
                   C 35 75, 35 55, 45 50
                   C 50 40, 80 40, 85 50
                   C 95 55, 95 75, 90 85
                   C 80 95, 50 95, 40 85 Z"
                fill="#FDE047" 
                stroke="#D97706" 
                strokeWidth="4" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              <path d="M55 52 L 55 85" stroke="#D97706" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
              <path d="M65 50 L 65 88" stroke="#D97706" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
              <path d="M75 52 L 75 85" stroke="#D97706" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
            </g>
          ) : (
            // Idle State: Open Hand
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
          )}
          
          {!isSlapping && (
            <path 
              d="M50 85 Q 60 95, 70 85" 
              stroke="#D97706" 
              strokeWidth="3" 
              strokeLinecap="round" 
              opacity="0.4"
            />
          )}
        </g>
      </svg>
    </div>
  );
};

export default HandCursor;