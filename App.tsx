import React, { useState, useEffect, useRef, useCallback } from 'react';
import HandCursor from './components/HandCursor';
import Mosquito from './components/Mosquito';
import BloodSplat from './components/BloodSplat';
import ScoreBoard from './components/ScoreBoard';
import { MosquitoState, BloodSplatData, Position } from './types';
import { audioManager } from './services/audioManager';

// Game Constants
const SCREEN_PADDING = 50;
const BASE_SPEED = 4;
const FLEE_DISTANCE = 300; // Pixel distance to trigger fleeing
const FLEE_SPEED_MULTIPLIER = 3.5;
const Z_AXIS_SPEED = 0.02;

const App: React.FC = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [isSlapping, setIsSlapping] = useState(false);
  
  // Game State Refs (High performance mutable state for game loop)
  const mousePos = useRef<Position>({ x: 0, y: 0 });
  const requestRef = useRef<number>(0);
  
  // We use a ref for the authoritative game state to avoid re-binding event listeners
  const mosquitoRef = useRef<MosquitoState>({
    id: 1,
    x: typeof window !== 'undefined' ? window.innerWidth / 2 : 400,
    y: typeof window !== 'undefined' ? window.innerHeight / 2 : 300,
    rotation: 0,
    scale: 1,
    isDead: false,
    velocity: { x: 2, y: 2 },
    targetScale: 1
  });

  // React State for rendering (synced from ref)
  const [renderMosquito, setRenderMosquito] = useState<MosquitoState>(mosquitoRef.current);
  const [splats, setSplats] = useState<BloodSplatData[]>([]);

  // Sound initialization
  const startGame = () => {
    audioManager.init();
    audioManager.resume();
    setGameStarted(true);
  };

  // Track mouse for game logic
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Main Game Loop
  const animate = useCallback(() => {
    if (!gameStarted) return;

    // Update Mosquito Physics
    const prev = mosquitoRef.current;
    
    if (!prev.isDead) {
      let { x, y, velocity, scale, targetScale } = prev;
      const width = window.innerWidth || 800;
      const height = window.innerHeight || 600;

      // 1. Calculate Distance to Mouse
      const dx = mousePos.current.x - x;
      const dy = mousePos.current.y - y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // 2. AI Behavior: Flee or Wander
      const isFleeing = dist < FLEE_DISTANCE && scale < 2.0;
      
      let speed = BASE_SPEED;
      
      if (isFleeing) {
        speed *= FLEE_SPEED_MULTIPLIER;
        velocity.x -= (dx / dist) * 0.5;
        velocity.y -= (dy / dist) * 0.5;
        targetScale = 0.5;
      } else {
        velocity.x += (Math.random() - 0.5) * 0.5;
        velocity.y += (Math.random() - 0.5) * 0.5;
        
        if (Math.abs(scale - targetScale) < 0.1) {
             targetScale = 0.5 + Math.random() * 2.0; 
        }
      }

      scale += (targetScale - scale) * Z_AXIS_SPEED;

      // Normalize velocity
      const velMag = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
      if (velMag > speed) {
        velocity.x = (velocity.x / velMag) * speed;
        velocity.y = (velocity.y / velMag) * speed;
      }

      x += velocity.x;
      y += velocity.y;

      // Bounce off walls
      if (x < SCREEN_PADDING) velocity.x = Math.abs(velocity.x);
      if (x > width - SCREEN_PADDING) velocity.x = -Math.abs(velocity.x);
      if (y < SCREEN_PADDING) velocity.y = Math.abs(velocity.y);
      if (y > height - SCREEN_PADDING) velocity.y = -Math.abs(velocity.y);

      // Rotation (Face direction + 180 correction for left-facing sprite)
      const angle = (Math.atan2(velocity.y, velocity.x) * (180 / Math.PI)) + 180;
      
      // Update Audio
      audioManager.updateBuzz(scale, prev.isDead);

      // Update Ref
      mosquitoRef.current = {
        ...prev,
        x,
        y,
        velocity,
        scale,
        targetScale,
        rotation: angle
      };
    }

    // Sync Ref to State for Render
    setRenderMosquito({...mosquitoRef.current});

    requestRef.current = requestAnimationFrame(animate);
  }, [gameStarted]);

  useEffect(() => {
    if (gameStarted) {
      requestRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [animate, gameStarted]);

  // Click / Slap Handler - Now stable and doesn't depend on changing 'mosquito' state
  const handleSlap = useCallback(() => {
    if (!gameStarted) return;
    
    setIsSlapping(true);
    audioManager.playSlapSound();

    setTimeout(() => setIsSlapping(false), 150);

    const mosquito = mosquitoRef.current;

    // Collision Detection
    const mosquitoRadius = 60 * mosquito.scale; // Slightly generous hitbox
    const dx = mousePos.current.x - mosquito.x;
    const dy = mousePos.current.y - mosquito.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Hit Logic
    if (distance < mosquitoRadius && !mosquito.isDead) {
      // KILL!
      audioManager.playSplatSound();
      setScore(s => s + 1);
      
      // Mark dead in ref immediately
      mosquitoRef.current.isDead = true;
      setRenderMosquito({...mosquitoRef.current}); // Force update

      // Add Blood Splat
      const newSplat: BloodSplatData = {
        id: Date.now(),
        x: mosquito.x,
        y: mosquito.y,
        scale: mosquito.scale * (0.8 + Math.random() * 0.5),
        rotation: Math.random() * 360,
        opacity: 0.9
      };
      setSplats(prev => [...prev, newSplat]);

      setTimeout(() => {
        setSplats(prev => prev.filter(s => s.id !== newSplat.id));
      }, 3000);

      // Respawn Logic
      setTimeout(() => {
        const side = Math.floor(Math.random() * 4);
        let startX = 0, startY = 0;
        const w = window.innerWidth;
        const h = window.innerHeight;

        switch(side) {
            case 0: startX = Math.random() * w; startY = -50; break;
            case 1: startX = w + 50; startY = Math.random() * h; break;
            case 2: startX = Math.random() * w; startY = h + 50; break;
            case 3: startX = -50; startY = Math.random() * h; break;
        }

        // Reset Ref
        mosquitoRef.current = {
          id: Date.now(),
          x: startX,
          y: startY,
          rotation: 0,
          scale: 0.5,
          isDead: false,
          velocity: { x: (Math.random() - 0.5) * 5, y: (Math.random() - 0.5) * 5 },
          targetScale: 1
        };
      }, 1000);
    }
  }, [gameStarted]);

  // Handle global click
  useEffect(() => {
    window.addEventListener('mousedown', handleSlap);
    return () => window.removeEventListener('mousedown', handleSlap);
  }, [handleSlap]);

  return (
    <div className="relative w-full h-full cursor-none overflow-hidden touch-none select-none">
      
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-orange-50 opacity-50 pointer-events-none"></div>

      {/* Start Screen Overlay */}
      {!gameStarted && (
        <div className="absolute inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <button 
            onClick={startGame}
            className="bg-red-600 hover:bg-red-700 text-white text-3xl font-black py-6 px-12 rounded-full shadow-2xl transform transition hover:scale-105 border-4 border-white"
            style={{ cursor: 'pointer' }}
          >
            START SWATTING
          </button>
        </div>
      )}

      {/* Game Components */}
      <ScoreBoard score={score} />
      
      {splats.map(splat => (
        <BloodSplat key={splat.id} data={splat} />
      ))}

      <Mosquito mosquito={renderMosquito} />

      <HandCursor isSlapping={isSlapping} />

      {gameStarted && score === 0 && (
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-gray-400 font-bold text-center pointer-events-none opacity-50">
          <p>Turn up your volume!</p>
          <p>Wait for it to get BIG to kill it.</p>
        </div>
      )}
    </div>
  );
};

export default App;