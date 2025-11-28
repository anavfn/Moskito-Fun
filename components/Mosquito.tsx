import React from 'react';
import { MosquitoState } from '../types';

interface MosquitoProps {
  mosquito: MosquitoState;
}

const Mosquito: React.FC<MosquitoProps> = ({ mosquito }) => {
  if (mosquito.isDead) return null;

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: mosquito.x,
        top: mosquito.y,
        width: '7rem', // w-28
        height: '7rem', // h-28
        // Scale simulates Z-depth. Rotation handles direction.
        transform: `translate(-50%, -50%) rotate(${mosquito.rotation}deg) scale(${mosquito.scale})`,
        zIndex: Math.floor(mosquito.scale * 10) + 10, // Ensure zIndex is always positive and above BG
        transition: 'transform 0.1s linear'
      }}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {/* CSS Animations are now defined in index.html for better performance */}
        <svg width="100%" height="100%" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-xl mosquito-container">
          
          {/* Back Wing - Blue-ish */}
          <path className="wing-back" d="M80 45 C 80 10, 110 0, 115 20 C 120 40, 95 55, 80 45" fill="#93C5FD" stroke="#3B82F6" strokeWidth="2" opacity="0.8" />

          {/* Legs */}
          <g stroke="#1F2937" strokeWidth="2" strokeLinecap="round" fill="none">
            {/* Back Legs */}
            <path d="M50 75 Q 40 90, 35 100" />
            <path d="M60 75 Q 60 95, 65 105" />
            {/* Front Leg */}
            <path d="M70 70 Q 85 85, 90 95" />
            {/* Striped Leg Effect (Dotted overlay) */}
            <path d="M50 75 Q 40 90, 35 100" stroke="white" strokeWidth="2" strokeDasharray="2 4" opacity="0.5"/>
            <path d="M60 75 Q 60 95, 65 105" stroke="white" strokeWidth="2" strokeDasharray="2 4" opacity="0.5"/>
          </g>

          {/* Body (Abdomen) - Pink with distinct stripes */}
          <g transform="rotate(-10 60 60)">
             {/* Main Shape */}
             <ellipse cx="75" cy="65" rx="35" ry="14" fill="#F87171" stroke="#7F1D1D" strokeWidth="2" />
             
             {/* Dark Stripes */}
             <path d="M52 58 Q 55 65, 52 72" stroke="#450a0a" strokeWidth="2" fill="none" />
             <path d="M62 55 Q 65 65, 62 75" stroke="#450a0a" strokeWidth="2" fill="none" />
             <path d="M72 54 Q 75 65, 72 76" stroke="#450a0a" strokeWidth="2" fill="none" />
             <path d="M82 55 Q 85 65, 82 75" stroke="#450a0a" strokeWidth="2" fill="none" />
             <path d="M92 58 Q 95 65, 92 72" stroke="#450a0a" strokeWidth="2" fill="none" />
             
             {/* Specular highlight */}
             <ellipse cx="75" cy="60" rx="25" ry="5" fill="white" opacity="0.2" />
          </g>

          {/* Front Wing - Lighter Blue */}
          <path className="wing-front" d="M55 45 C 45 5, 85 -10, 95 15 C 105 35, 70 50, 55 45" fill="#BAE6FD" stroke="#3B82F6" strokeWidth="2" opacity="0.9" />

          {/* Thorax (Middle section) */}
          <circle cx="50" cy="55" r="13" fill="#EF4444" stroke="#7F1D1D" strokeWidth="2" />
          {/* Thorax Pattern */}
          <path d="M45 50 L 55 60 M 55 50 L 45 60" stroke="#7F1D1D" strokeWidth="1" />

          {/* Head */}
          <circle cx="35" cy="50" r="11" fill="#EF4444" stroke="#7F1D1D" strokeWidth="2" />

          {/* Eyes - Big and Angry */}
          <g transform="translate(35, 50)">
            {/* Left Eye */}
            <ellipse cx="-5" cy="-3" rx="6" ry="7" fill="white" stroke="#1F2937" strokeWidth="1" />
            <circle cx="-4" cy="-3" r="2" fill="black" />
            
            {/* Right Eye */}
            <ellipse cx="5" cy="-3" rx="6" ry="7" fill="white" stroke="#1F2937" strokeWidth="1" />
            <circle cx="4" cy="-3" r="2" fill="black" />
            
            {/* Angry Eyebrows */}
            <path d="M-10 -10 L -2 -5" stroke="black" strokeWidth="2" strokeLinecap="round" />
            <path d="M10 -10 L 2 -5" stroke="black" strokeWidth="2" strokeLinecap="round" />
          </g>

          {/* Proboscis (Nose) - Sharp and Long */}
          <path d="M24 55 Q 15 60, 5 75" stroke="#1F2937" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M24 55 Q 15 60, 5 75" stroke="#4B5563" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.5"/>

        </svg>
      </div>
    </div>
  );
};

export default Mosquito;