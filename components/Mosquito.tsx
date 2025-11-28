import React from 'react';
import { MosquitoState } from '../types';

interface MosquitoProps {
  mosquito: MosquitoState;
}

const Mosquito: React.FC<MosquitoProps> = ({ mosquito }) => {
  if (mosquito.isDead) return null;

  return (
    <div
      className="absolute pointer-events-none will-change-transform"
      style={{
        left: mosquito.x,
        top: mosquito.y,
        // Scale simulates Z-depth. Rotation handles direction.
        transform: `translate(-50%, -50%) rotate(${mosquito.rotation}deg) scale(${mosquito.scale})`,
        zIndex: Math.floor(mosquito.scale * 10), 
        transition: 'transform 0.1s linear'
      }}
    >
      <div className="relative w-28 h-28 flex items-center justify-center">
        <style>
          {`
            @keyframes wingFlutter {
              0% { transform: scaleY(1) rotate(0deg); }
              50% { transform: scaleY(0.8) rotate(15deg); }
              100% { transform: scaleY(1) rotate(0deg); }
            }
            @keyframes hoverWobble {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-5px); }
            }
            .wing-back { transform-origin: 50% 100%; animation: wingFlutter 0.08s infinite reverse; }
            .wing-front { transform-origin: 50% 100%; animation: wingFlutter 0.08s infinite; }
            .mosquito-container { animation: hoverWobble 0.5s infinite ease-in-out; }
          `}
        </style>

        <svg width="100%" height="100%" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-xl mosquito-container">
          
          {/* Back Wing */}
          <path className="wing-back" d="M65 45 C 65 10, 100 0, 105 20 C 110 40, 80 55, 65 45" fill="#93C5FD" stroke="#3B82F6" strokeWidth="2" opacity="0.8" />

          {/* Legs */}
          <g stroke="#1F2937" strokeWidth="2" strokeLinecap="round" fill="none">
            <path d="M50 75 Q 45 90, 40 100" />
            <path d="M60 75 Q 60 95, 65 105" />
            <path d="M70 70 Q 85 85, 90 95" />
            <path d="M45 70 Q 35 80, 25 85" strokeDasharray="3 3"/> 
          </g>

          {/* Body (Abdomen) - Pink with stripes */}
          <g transform="rotate(-10 60 60)">
             {/* Main Shape */}
             <ellipse cx="75" cy="65" rx="35" ry="14" fill="#F87171" stroke="#991B1B" strokeWidth="2" />
             
             {/* Stripes */}
             <path d="M55 56 Q 58 65, 55 74" stroke="#7F1D1D" strokeWidth="2" fill="none" />
             <path d="M65 53 Q 68 65, 65 77" stroke="#7F1D1D" strokeWidth="2" fill="none" />
             <path d="M75 52 Q 78 65, 75 78" stroke="#7F1D1D" strokeWidth="2" fill="none" />
             <path d="M85 53 Q 88 65, 85 77" stroke="#7F1D1D" strokeWidth="2" fill="none" />
             <path d="M95 56 Q 98 65, 95 74" stroke="#7F1D1D" strokeWidth="2" fill="none" />
          </g>

          {/* Front Wing */}
          <path className="wing-front" d="M55 45 C 45 5, 85 -10, 95 15 C 105 35, 70 50, 55 45" fill="#BAE6FD" stroke="#3B82F6" strokeWidth="2" opacity="0.9" />

          {/* Thorax (Middle section) */}
          <circle cx="50" cy="55" r="12" fill="#F87171" stroke="#991B1B" strokeWidth="2" />

          {/* Head */}
          <circle cx="35" cy="50" r="10" fill="#F87171" stroke="#991B1B" strokeWidth="2" />

          {/* Eyes */}
          <g transform="translate(35, 50)">
            {/* Left Eye */}
            <ellipse cx="-4" cy="-3" rx="5" ry="6" fill="white" stroke="#1F2937" strokeWidth="1" />
            <circle cx="-4" cy="-3" r="1.5" fill="black" />
            
            {/* Right Eye */}
            <ellipse cx="4" cy="-3" rx="5" ry="6" fill="white" stroke="#1F2937" strokeWidth="1" />
            <circle cx="4" cy="-3" r="1.5" fill="black" />
            
            {/* Eyebrows (Angry) */}
            <path d="M-8 -8 L -2 -5" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M8 -8 L 2 -5" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
          </g>

          {/* Proboscis (Nose) */}
          <path d="M25 55 Q 15 65, 5 80" stroke="#1F2937" strokeWidth="3" fill="none" strokeLinecap="round" />

        </svg>
      </div>
    </div>
  );
};

export default Mosquito;