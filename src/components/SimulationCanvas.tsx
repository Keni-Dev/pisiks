import { useCallback, useState, useRef, useEffect } from 'react';
import { useCanvas } from '../hooks/useCanvas';
import { useAnimationLoop } from '../hooks/useAnimationLoop';
import type { PhysicsState } from '../lib/physics';
import { calculateVelocity, calculateDisplacement } from '../lib/physics';

interface SimulationCanvasProps {
  isRunning: boolean;
  setIsRunning: (isRunning: boolean) => void;
  simulationParams: {
    u: number;  // initial velocity (m/s)
    a: number;  // acceleration (m/s²)
    duration: number;  // total simulation time (s)
  };
}

export default function SimulationCanvas({ isRunning, setIsRunning, simulationParams }: SimulationCanvasProps) {
  const [physicsState, setPhysicsState] = useState<PhysicsState>({
    time: 0,
    velocity: 0,
    displacement: 0
  });

  // Use a ref to avoid stale closures in the animation loop
  const physicsStateRef = useRef(physicsState);
  
  // Keep the ref in sync with the state
  useEffect(() => {
    physicsStateRef.current = physicsState;
  }, [physicsState]);

  // Reset physics state when simulation stops
  useEffect(() => {
    if (!isRunning) {
      setPhysicsState({
        time: 0,
        velocity: 0,
        displacement: 0
      });
    }
  }, [isRunning]);

  // Update function called on each frame
  const update = useCallback((deltaTime: number) => {
    // Increment simulation time
    const newTime = physicsStateRef.current.time + deltaTime;

    // Stop if duration exceeded
    if (newTime >= simulationParams.duration) {
      setIsRunning(false);
      return;
    }

    // Calculate new physics values using our formulas
    const newVelocity = calculateVelocity(simulationParams.u, simulationParams.a, newTime);
    const newDisplacement = calculateDisplacement(simulationParams.u, simulationParams.a, newTime);

    // Update the physics state
    setPhysicsState({
      time: newTime,
      velocity: newVelocity,
      displacement: newDisplacement
    });
  }, [simulationParams, setIsRunning]);

  // Start the animation loop
  useAnimationLoop(update, isRunning);

  const draw = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set background color
    ctx.fillStyle = '#F8FAFC';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Scale for converting meters to pixels
    const PIXELS_PER_METER = 10;

    // Calculate ball's screen position
    const screenX = 50 + physicsState.displacement * PIXELS_PER_METER;
    const screenY = 200; // Keep Y position constant for now

    // Draw the ball at its current position
    const radius = 15; // 30px diameter = 15px radius

    ctx.beginPath();
    ctx.arc(screenX, screenY, radius, 0, 2 * Math.PI);
    ctx.fillStyle = '#FB923C'; // Orange color (Tailwind orange-400)
    ctx.fill();
  }, [physicsState]);

  const canvasRef = useCanvas(draw);

  return (
    <div className="bg-white rounded-lg shadow-md border border-slate-200 p-6">
      <canvas
        ref={canvasRef}
        width={800}
        height={400}
        className="border border-slate-300 rounded-md mx-auto block"
      />
    </div>
  );
}
