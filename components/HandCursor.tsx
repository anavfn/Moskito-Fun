import React, { useEffect, useState } from 'react';

interface HandCursorProps {
  isSlapping: boolean;
}

const HandCursor: React.FC<HandCursorProps> = ({ isSlapping }) => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - position.x;
      // Add a little tilt based on horizontal movement for liveliness
      const targetRotation = Math.max(-15, Math.min(15, dx * 0.8));
      
      setRotation(prev => prev + (targetRotation - prev) * 0.3);
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [position.x]);

  return (
    <div
      className="fixed pointer-events-none z-[100] transition-transform duration-100 ease-out will-change-transform"
      style={{
        left: position.x,
        top: position.y,
        // Offset translate ensures the "palm" is centered on the mouse
        transform: `translate(-45%, -40%) rotate(${rotation}deg) scale(${isSlapping ? 0.9 : 1})`,
      }}
    >
      <svg width="200" height="200" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="cute-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="#000" floodOpacity="0.15"/>
          </filter>
        </defs>

        <g filter="url(#cute-shadow)">
          {isSlapping ? (
            // Slapping State: Fingers together, nice smooth blob shape
            <path 
              d="M35 80 
                 C 25 75, 20 50, 40 45
                 L 45 35 
                 C 48 20, 58 20, 60 35 
                 L 62 32 
                 C 65 15, 75 15, 78 32
                 L 80 35 
                 C 83 20, 93 20, 96 35
                 L 95 60 
                 C 95 85, 80 100, 60 100 
                 C 45 100, 40 85, 35 80 Z"
              fill="#FDE047" 
              stroke="#D97706" 
              strokeWidth="4" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          ) : (
            // Idle State: Smoother fingers, fixing the "out a little" glitch
            <path 
              d="M30 70 
                 C 20 60, 25 45, 35 48 
                 L 40 50
                 L 38 25 C 36 12, 50 12, 52 25 
                 L 54 50
                 L 56 15 C 56 2, 72 2, 72 15 
                 L 70 50
                 L 78 20 C 80 10, 94 10, 92 20 
                 L 82 55
                 L 95 45 C 105 40, 110 55, 100 65 
                 L 85 80
                 C 75 100, 45 100, 40 90 
                 C 35 85, 35 75, 30 70 Z"
              fill="#FDE047" 
              stroke="#D97706" 
              strokeWidth="4" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          )}
          
          {/* Palm details */}
          <path 
            d="M48 80 Q 60 90, 72 80" 
            stroke="#D97706" 
            strokeWidth="3" 
            strokeLinecap="round" 
            opacity="0.4"
          />
        </g>
      </svg>
    </div>
  );
};

export default HandCursor;