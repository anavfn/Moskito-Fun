export interface Position {
  x: number;
  y: number;
}

export interface MosquitoState {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number; // Represents distance/closeness. 0.5 (far) to 2.5 (close)
  isDead: boolean;
  velocity: Position;
  targetScale: number; // For smoothly animating Z-axis
}

export interface BloodSplatData {
  id: number;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  opacity: number;
}
