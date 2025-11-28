import React from 'react';
import { BloodSplatData } from '../types';

interface BloodSplatProps {
  data: BloodSplatData;
}

const BloodSplat: React.FC<BloodSplatProps> = ({ data }) => {
  return (
    <div
      className="absolute pointer-events-none z-10"
      style={{
        left: data.x,
        top: data.y,
        transform: `translate(-50%, -50%) scale(${data.scale}) rotate(${data.rotation}deg)`,
        opacity: data.opacity,
        transition: 'opacity 0.1s linear'
      }}
    >
      <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 40C110 30 140 20 150 50C160 80 140 90 150 110C160 130 190 140 160 160C130 180 120 160 100 170C80 180 60 190 40 160C20 130 50 120 40 100C30 80 10 60 40 40C70 20 90 50 100 40Z" fill="#880808" />
        <circle cx="120" cy="80" r="10" fill="#660000" />
        <circle cx="70" cy="130" r="8" fill="#660000" />
        <circle cx="160" cy="140" r="5" fill="#660000" />
        <circle cx="30" cy="50" r="6" fill="#660000" />
      </svg>
    </div>
  );
};

export default BloodSplat;
