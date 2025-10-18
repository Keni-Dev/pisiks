import { useCallback, useState } from 'react';
import { useCanvas } from '../hooks/useCanvas';
import { useAnimationLoop } from '../hooks/useAnimationLoop';

export default function SimulationCanvas() {
  const [ballPosition, setBallPosition] = useState({ x: 50, y: 200 });

  // Update function called on each frame
  const update = useCallback(() => {
    setBallPosition((prev) => ({
      x: prev.x + 1,
      y: prev.y,
    }));
  }, []);

  // Start the animation loop
  useAnimationLoop(update);

  const draw = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set background color
    ctx.fillStyle = '#F8FAFC';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw the ball at its current position
    const radius = 15; // 30px diameter = 15px radius

    ctx.beginPath();
    ctx.arc(ballPosition.x, ballPosition.y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = '#FB923C'; // Orange color (Tailwind orange-400)
    ctx.fill();
  }, [ballPosition]);

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
