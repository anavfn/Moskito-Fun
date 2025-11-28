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
      const targetRotation = Math.max(-15, Math.min(15, dx * 0.8));
      
      setRotation(prev => prev + (targetRotation - prev) * 0.3);
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [position.x]);

  return (
    <div
      className="fixed pointer-events-none z-[100] transition-transform duration-75 ease-out will-change-transform"
      style={{
        left: position.x,
        top: position.y,
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
            // Slapping State: Compact, fingers together
            <path 
              d="M35 85 
                 C 25 80, 20 50, 45 40
                 L 48 30 
                 C 50 15, 60 15, 62 30 
                 L 64 28 
                 C 66 12, 76 12, 78 28
                 L 80 30 
                 C 82 15, 92 15, 94 30
                 L 95 60 
                 C 95 85, 80 100, 60 100 
                 C 45 100, 40 90, 35 85 Z"
              fill="#FDE047" 
              stroke="#D97706" 
              strokeWidth="4" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          ) : (
            // Idle State: Single clean path for spread fingers to avoid overlaps
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
          
          {/* Palm details */}
          <path 
            d="M50 85 Q 60 95, 70 85" 
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