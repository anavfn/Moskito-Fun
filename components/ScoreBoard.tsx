import React from 'react';
import { Bug } from 'lucide-react';

interface ScoreBoardProps {
  score: number;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ score }) => {
  return (
    <div className="fixed top-6 right-8 z-50 flex flex-col items-center">
      {/* Prohibition Sign */}
      <div className="relative w-20 h-20 bg-white/90 backdrop-blur rounded-full border-[6px] border-red-600 shadow-xl flex items-center justify-center transform hover:scale-110 transition-transform duration-300">
        
        {/* Mosquito Icon (Black silhouette) */}
        <Bug className="w-12 h-12 text-gray-900" strokeWidth={2.5} />
        
        {/* Diagonal Slash */}
        <div className="absolute w-[6px] h-full bg-red-600 rounded-full transform -rotate-45"></div>

        {/* Score Badge */}
        <div className="absolute -bottom-3 bg-red-600 text-white px-3 py-0.5 rounded-full text-sm font-bold shadow-md border-2 border-white">
          {score}
        </div>
      </div>
    </div>
  );
};

export default ScoreBoard;