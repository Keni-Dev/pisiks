import { useCallback, useRef, useEffect, useState, memo, useMemo } from 'react';
import { useCanvas } from '../hooks/useCanvas';
import { useAnimationLoop } from '../hooks/useAnimationLoop';
import type { PhysicsState } from '../lib/physics';
import type { GraphDataPoint } from '../lib/types';
import { calculateVelocity, calculateDisplacement } from '../lib/physics';
import { drawBall, drawCar, drawRocket } from '../lib/drawing';

interface SimulationCanvasProps {
  isRunning: boolean;
  setIsRunning: (isRunning: boolean) => void;
  simulationParams: {
    u: number;  // initial velocity (m/s)
    a: number;  // acceleration (m/s²)
    duration: number;  // total simulation time (s)
    height: number;  // initial height for freefall (m)
    objectType: 'ball' | 'car' | 'rocket';
  };
  resetKey: number;
  physicsState: PhysicsState;
  onUpdatePhysics: (newState: PhysicsState) => void;
  onSimulationEnd: (data: GraphDataPoint[]) => void;
  minDisplacement: number;
  maxDisplacement: number;
  viewMode: 'horizontal' | 'vertical';
  objectType?: 'ball' | 'car' | 'rocket';
}

// Helper function moved outside component to avoid recreation
const calculateMarkerInterval = (scale: number): number => {
  const intervals = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000];
  const targetMarkerSpacing = 60; // pixels between markers
  
  for (const interval of intervals) {
    const spacing = interval * scale;
    if (spacing >= targetMarkerSpacing) {
      return interval;
    }
  }
  return intervals[intervals.length - 1];
};

const SimulationCanvas = memo(function SimulationCanvas({ 
  isRunning, 
  setIsRunning, 
  simulationParams, 
  resetKey, 
  physicsState,
  onUpdatePhysics,
  onSimulationEnd,
  minDisplacement,
  maxDisplacement,
  viewMode,
  objectType
}: SimulationCanvasProps) {
  // Viewport state for zoom and pan
  const [viewport, setViewport] = useState({
    scale: 10,      // pixels per meter
    originX: 50,    // x position of physics origin (0,0) in pixels
    originY: 200    // y position of physics origin (0,0) in pixels
  });

  // Position history for trail effect
  const [positionHistory, setPositionHistory] = useState<{ x: number; y: number }[]>([]);
  const frameCounterRef = useRef(0);

  // Offscreen canvas for background/environment (cached)
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const backgroundCacheValidRef = useRef(false);

  // Data collection for graphs
  const graphDataRef = useRef<GraphDataPoint[]>([]);
  const lastCaptureTimeRef = useRef(0);
  const DATA_CAPTURE_INTERVAL = 0.1; // seconds

  // Use a ref to avoid stale closures in the animation loop
  const physicsStateRef = useRef(physicsState);
  
  // Memoize marker interval calculation
  const markerInterval = useMemo(() => {
    return calculateMarkerInterval(viewport.scale);
  }, [viewport.scale]);
  
  // Keep the ref in sync with the state
  useEffect(() => {
    physicsStateRef.current = physicsState;
  }, [physicsState]);

  // Reset physics state when resetKey changes
  useEffect(() => {
    onUpdatePhysics({
      time: 0,
      velocity: 0,
      displacement: 0
    });
    // Clear position history on reset
    setPositionHistory([]);
    frameCounterRef.current = 0;
    // Clear graph data on reset
    graphDataRef.current = [];
    lastCaptureTimeRef.current = 0;
  }, [resetKey, onUpdatePhysics]);

  // Reset physics state when simulation stops
  useEffect(() => {
    if (!isRunning) {
      onUpdatePhysics({
        time: 0,
        velocity: 0,
        displacement: 0
      });
      // Clear position history when stopped
      setPositionHistory([]);
      frameCounterRef.current = 0;
      // Clear graph data when stopped
      graphDataRef.current = [];
      lastCaptureTimeRef.current = 0;
    }
  }, [isRunning, onUpdatePhysics]);

  // Update viewport when motion bounds change
  useEffect(() => {
    const canvasWidth = 800;  // matches canvas width
    const canvasHeight = 400; // matches canvas height
    
    // Calculate the range of motion
    const motionRange = maxDisplacement - minDisplacement;
    
    // Handle edge case where there's no motion (duration = 0 or very small)
    if (motionRange === 0 || !isFinite(motionRange)) {
      setViewport({
        scale: 10,
        originX: canvasWidth / 2,
        originY: canvasHeight / 2
      });
      // Invalidate background cache
      backgroundCacheValidRef.current = false;
      return;
    }
    
    if (viewMode === 'horizontal') {
      // Horizontal mode: fit motion in 80% of canvas width
      const newScale = (canvasWidth * 0.8) / motionRange;
      
      // Calculate origin X to center the motion range
      // We want minDisplacement to appear at 10% of canvas width
      const newOriginX = canvasWidth * 0.1 - (minDisplacement * newScale);
      
      // Keep Y centered vertically
      const newOriginY = canvasHeight / 2;
      
      setViewport({
        scale: newScale,
        originX: newOriginX,
        originY: newOriginY
      });
    } else {
      // Vertical mode: fit motion in 80% of canvas height
      const maxHeight = simulationParams.height;
      const minHeight = Math.max(0, maxHeight + minDisplacement);
      const heightRange = maxHeight - minHeight;
      
      // Calculate scale to fit the height range
      const usableHeight = canvasHeight - 80;
      const newScale = heightRange > 0 ? (usableHeight * 0.8) / heightRange : 10;
      
      const newOriginX = 110;
      const newOriginY = canvasHeight / 2;
      
      setViewport({
        scale: newScale,
        originX: newOriginX,
        originY: newOriginY
      });
    }
    
    // Invalidate background cache when viewport changes
    backgroundCacheValidRef.current = false;
  }, [minDisplacement, maxDisplacement, viewMode, simulationParams.height]);

  // Update function called on each frame
  const update = useCallback((deltaTime: number) => {
    // Increment simulation time
    const newTime = physicsStateRef.current.time + deltaTime;

    // Stop if duration exceeded
    if (newTime >= simulationParams.duration) {
      setIsRunning(false);
      // Send collected graph data to parent
      onSimulationEnd(graphDataRef.current);
      return;
    }

    // Calculate new physics values
    const newVelocity = calculateVelocity(simulationParams.u, simulationParams.a, newTime);
    const newDisplacement = calculateDisplacement(simulationParams.u, simulationParams.a, newTime);

    // Update the physics state
    onUpdatePhysics({
      time: newTime,
      velocity: newVelocity,
      displacement: newDisplacement
    });

    // Collect data for graphs at fixed intervals
    if (newTime - lastCaptureTimeRef.current >= DATA_CAPTURE_INTERVAL) {
      graphDataRef.current.push({
        t: newTime,
        v: newVelocity,
        s: newDisplacement
      });
      lastCaptureTimeRef.current = newTime;
    }

    // Update position history for trail effect (every 3 frames)
    frameCounterRef.current++;
    if (frameCounterRef.current % 3 === 0) {
      let trailX: number;
      let trailY: number;

      if (viewMode === 'horizontal') {
        trailX = viewport.originX + newDisplacement * viewport.scale;
        trailY = viewport.originY;
      } else {
        const currentHeight = simulationParams.height + newDisplacement;
        trailX = 80 + 30;
        const groundY = 400 - 40;
        trailY = groundY - (currentHeight * viewport.scale);
      }

      setPositionHistory((prev) => {
        const newHistory = [...prev, { x: trailX, y: trailY }];
        return newHistory.slice(-50);
      });
    }
  }, [simulationParams, setIsRunning, onUpdatePhysics, onSimulationEnd, viewport, viewMode]);

  // Start the animation loop
  useAnimationLoop(update, isRunning);

  const draw = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Use offscreen canvas for background/environment (performance optimization)
    if (!backgroundCacheValidRef.current || !offscreenCanvasRef.current) {
      // Create or get offscreen canvas
      if (!offscreenCanvasRef.current) {
        offscreenCanvasRef.current = document.createElement('canvas');
        offscreenCanvasRef.current.width = canvas.width;
        offscreenCanvasRef.current.height = canvas.height;
      }
      
      const offscreenCtx = offscreenCanvasRef.current.getContext('2d');
      if (offscreenCtx) {
        // Clear offscreen canvas
        offscreenCtx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw environment
        drawEnvironment(offscreenCtx, canvas, viewport, viewMode);
        
        // Draw markers
        drawMarkers(offscreenCtx, canvas, viewport, viewMode, markerInterval, minDisplacement, maxDisplacement, simulationParams.height);
        
        // Mark cache as valid
        backgroundCacheValidRef.current = true;
      }
    }
    
    // Copy offscreen canvas to main canvas
    if (offscreenCanvasRef.current) {
      ctx.drawImage(offscreenCanvasRef.current, 0, 0);
    }

    // Draw position trail
    if (positionHistory.length > 0) {
      positionHistory.forEach((pos, index) => {
        const age = positionHistory.length - index;
        const opacity = Math.max(0.05, 1 - (age / positionHistory.length));
        
        ctx.fillStyle = `rgba(100, 100, 255, ${opacity * 0.4})`;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 3, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // Calculate object's screen position
    let screenX: number;
    let screenY: number;
    
    if (viewMode === 'horizontal') {
      screenX = viewport.originX + physicsState.displacement * viewport.scale;
      screenY = viewport.originY;
    } else {
      const currentHeight = simulationParams.height + physicsState.displacement;
      screenX = 80 + 30;
      const groundY = canvas.height - 40;
      screenY = groundY - (currentHeight * viewport.scale);
    }

    // Calculate velocity-based scaling
    const MAX_VELOCITY = 50;
    const velocityMagnitude = Math.abs(physicsState.velocity);
    const sizeScale = 1 + Math.min(velocityMagnitude / MAX_VELOCITY, 1) * 0.3;

    // Draw the object
    const drawType = objectType ?? 'ball';
    const objX = screenX;
    const objY = screenY;

    // Calculate rotation for rocket
    let rotation = 0;
    if (drawType === 'rocket') {
      if (viewMode === 'horizontal') {
        if (physicsState.velocity > 0.1) {
          rotation = Math.PI / 2;
        } else if (physicsState.velocity < -0.1) {
          rotation = -Math.PI / 2;
        }
      } else {
        if (physicsState.velocity < -0.1) {
          rotation = Math.PI;
        } else if (physicsState.velocity > 0.1) {
          rotation = 0;
        }
      }
    }

    // Draw object based on type
    switch (drawType) {
      case 'ball':
        drawBall(ctx, objX, objY, 12 * sizeScale, '#ff6b6b');
        break;
      
      case 'car':
        drawCar(ctx, objX, objY, 28 * sizeScale, 14 * sizeScale, '#4dabf7');
        break;
      
      case 'rocket':
        drawRocket(ctx, objX, objY, 20 * sizeScale, 32 * sizeScale, '#ffd43b', rotation);
        break;
      
      default:
        drawBall(ctx, objX, objY, 12 * sizeScale, '#ff6b6b');
    }
  }, [physicsState, viewport, minDisplacement, maxDisplacement, viewMode, simulationParams.height, objectType, positionHistory, markerInterval]);

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
});

// Helper function to draw environment
function drawEnvironment(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  viewport: { scale: number; originX: number; originY: number },
  viewMode: 'horizontal' | 'vertical'
) {
  if (viewMode === 'horizontal') {
    // Draw sky gradient
    const skyGradient = ctx.createLinearGradient(0, 0, 0, viewport.originY);
    skyGradient.addColorStop(0, '#87CEEB');
    skyGradient.addColorStop(1, '#E0F6FF');
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, canvas.width, viewport.originY);
    
    // Draw ground
    ctx.fillStyle = '#8B7355';
    ctx.fillRect(0, viewport.originY, canvas.width, canvas.height - viewport.originY);
    
    // Draw ground line
    ctx.strokeStyle = '#4A3728';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, viewport.originY);
    ctx.lineTo(canvas.width, viewport.originY);
    ctx.stroke();
  } else {
    // Vertical mode - draw building/cliff
    ctx.fillStyle = '#6B4423';
    ctx.fillRect(0, 0, 80, canvas.height);
    
    ctx.strokeStyle = '#4A2F1A';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(80, 0);
    ctx.lineTo(80, canvas.height);
    ctx.stroke();
    
    // Draw sky
    const skyGradient = ctx.createLinearGradient(80, 0, canvas.width, 0);
    skyGradient.addColorStop(0, '#E0F6FF');
    skyGradient.addColorStop(0.5, '#87CEEB');
    ctx.fillStyle = skyGradient;
    ctx.fillRect(80, 0, canvas.width - 80, canvas.height);
    
    // Draw ground
    const groundY = canvas.height - 40;
    ctx.fillStyle = '#8B7355';
    ctx.fillRect(80, groundY, canvas.width - 80, 40);
    
    ctx.strokeStyle = '#4A3728';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(80, groundY);
    ctx.lineTo(canvas.width, groundY);
    ctx.stroke();
  }
}

// Helper function to draw markers
function drawMarkers(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  viewport: { scale: number; originX: number; originY: number },
  viewMode: 'horizontal' | 'vertical',
  markerInterval: number,
  minDisplacement: number,
  maxDisplacement: number,
  height: number
) {
  if (viewMode === 'horizontal') {
    const start = Math.floor(minDisplacement / markerInterval) * markerInterval;
    const end = Math.ceil(maxDisplacement / markerInterval) * markerInterval;
    
    for (let displacement = start; displacement <= end; displacement += markerInterval) {
      const screenX = viewport.originX + displacement * viewport.scale;
      
      if (screenX >= 0 && screenX <= canvas.width) {
        // Draw tick mark
        const tickY = viewport.originY;
        ctx.strokeStyle = '#1E293B';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(screenX, tickY - 15);
        ctx.lineTo(screenX, tickY + 15);
        ctx.stroke();
        
        // Draw label
        const label = `${displacement}m`;
        ctx.font = 'bold 14px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        
        const metrics = ctx.measureText(label);
        const textWidth = metrics.width;
        const textHeight = 16;
        const padding = 4;
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.strokeStyle = '#CBD5E1';
        ctx.lineWidth = 1;
        const bgX = screenX - textWidth / 2 - padding;
        const bgY = tickY + 20;
        ctx.fillRect(bgX, bgY, textWidth + padding * 2, textHeight + padding * 2);
        ctx.strokeRect(bgX, bgY, textWidth + padding * 2, textHeight + padding * 2);
        
        ctx.fillStyle = '#0F172A';
        ctx.fillText(label, screenX, tickY + 20 + padding);
      }
    }
  } else {
    // Vertical mode
    const heightStart = 0;
    const heightEnd = Math.ceil(height / markerInterval) * markerInterval;
    
    for (let h = heightStart; h <= heightEnd; h += markerInterval) {
      const groundY = canvas.height - 40;
      const screenY = groundY - (h * viewport.scale);
      
      if (screenY >= 0 && screenY <= canvas.height) {
        const tickX = 60;
        ctx.strokeStyle = '#1E293B';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(tickX - 8, screenY);
        ctx.lineTo(tickX + 8, screenY);
        ctx.stroke();
        
        const label = `${h}m`;
        ctx.font = 'bold 14px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        
        const metrics = ctx.measureText(label);
        const textWidth = metrics.width;
        const textHeight = 16;
        const padding = 4;
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.strokeStyle = '#CBD5E1';
        ctx.lineWidth = 1;
        const bgX = tickX - 15 - textWidth - padding * 2;
        const bgY = screenY - textHeight / 2 - padding;
        ctx.fillRect(bgX, bgY, textWidth + padding * 2, textHeight + padding * 2);
        ctx.strokeRect(bgX, bgY, textWidth + padding * 2, textHeight + padding * 2);
        
        ctx.fillStyle = '#0F172A';
        ctx.fillText(label, tickX - 15 - padding, screenY);
      }
    }
  }
}

export default SimulationCanvas;
