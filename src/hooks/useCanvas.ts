import { useEffect, useRef } from 'react';

type DrawFunction = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => void;

export function useCanvas(draw: DrawFunction) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    draw(ctx, canvas);
  }, [draw]);

  return canvasRef;
}
