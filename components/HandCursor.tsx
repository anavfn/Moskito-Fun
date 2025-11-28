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
            // Slapping State: Fingers together, dynamic swat shape
            <path 
              d="M30 60 
                 C 20 50, 20 30, 40 25
                 L 45 15 C 48 5, 58 5, 60 15 
                 L 62 12 C 65 2, 75 2, 78 12
                 L 80 15 C 83 5, 93 5, 96 15
                 L 95 50 
                 C 95 70, 80 90, 60 95 
                 C 40 90, 30 70, 30 60 Z"
              fill="#FDE047" 
              stroke="#D97706" 
              strokeWidth="4" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          ) : (
            // Idle State: Cute open hand, spread fingers
            <path 
              d="M25 65 
                 C 15 55, 10 35, 30 40 
                 L 35 45
                 L 32 20 C 30 8, 45 8, 48 20 
                 L 50 45
                 L 52 10 C 52 -2, 68 -2, 70 10 
                 L 68 45
                 L 75 15 C 78 5, 92 5, 90 15 
                 L 80 48
                 L 95 35 C 105 30, 110 45, 100 55 
                 L 85 70
                 C 80 95, 50 95, 40 85 
                 C 30 80, 25 65, 25 65 Z"
              fill="#FDE047" 
              stroke="#D97706" 
              strokeWidth="4" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          )}
          
          {/* Palm details for cuteness */}
          <path 
            d="M45 75 Q 60 85, 75 75" 
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