import { useCallback, useRef, useEffect, useLayoutEffect, useState, memo, useMemo } from 'react';
import { useCanvas } from '../hooks/useCanvas';
import { useAnimationLoop } from '../hooks/useAnimationLoop';
import type { PhysicsState } from '../lib/physics';
import type { GraphDataPoint } from '../lib/types';
import { calculateVelocity, calculateDisplacement, calculateMotionBounds } from '../lib/physics';
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

// Small util
const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

// Shared camera pan margin in pixels. We also align the initial 0m position to this value
// so that pressing Start does not cause a slight camera correction.
const PAN_MARGIN_PX = 100;

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
  // Compute effective motion bounds locally to avoid an initial frame with 0-range bounds
  const { minDisplacement: effectiveMinDisp, maxDisplacement: effectiveMaxDisp } = useMemo(() => {
    const incoming = { min: minDisplacement, max: maxDisplacement };
    const computed = calculateMotionBounds(
      simulationParams.u,
      simulationParams.a,
      simulationParams.duration
    );
    const incomingRange = incoming.max - incoming.min;
    const computedRange = computed.maxDisplacement - computed.minDisplacement;
    // If parent hasn't computed bounds yet (range 0) but physics implies motion, use computed
    if ((incomingRange === 0) && (computedRange !== 0)) {
      return { minDisplacement: computed.minDisplacement, maxDisplacement: computed.maxDisplacement };
    }
    return { minDisplacement: incoming.min, maxDisplacement: incoming.max };
  }, [minDisplacement, maxDisplacement, simulationParams.u, simulationParams.a, simulationParams.duration]);
  // Viewport state for zoom and pan
  const [viewport, setViewport] = useState(() => {
    // Initialize viewport based on initial view mode and motion bounds
    const canvasWidth = 800;
    const canvasHeight = 400;
    
    if (viewMode === 'vertical') {
      // Calculate initial scale for vertical mode using absolute height bounds
      const usableHeight = canvasHeight - 80;
      const minHeightAbs = Math.max(0, simulationParams.height + effectiveMinDisp);
      const maxHeightAbs = Math.max(minHeightAbs, simulationParams.height + effectiveMaxDisp);
      const heightRange = Math.max(0.0001, maxHeightAbs - minHeightAbs);
      const scale = (usableHeight * 0.8) / heightRange;

      // Place the object within safe margins at t=0 to avoid a first-frame pan "jump"
      const groundY = canvasHeight - 40;
      const margin = 100;
      const neutralY = groundY - (simulationParams.height * scale);
      const desiredY = clamp(neutralY, margin, canvasHeight - margin);
      const originYOffset = desiredY - neutralY; // delta to keep object within margins
      
      return {
        scale,
        originX: 110,
        originY: canvasHeight / 2 + originYOffset,
      };
    } else {
      // Calculate initial scale for horizontal mode
      const motionRange = Math.abs(effectiveMaxDisp - effectiveMinDisp);
      const scale = motionRange > 0 ? (canvasWidth * 0.8) / motionRange : 10;
      
      return {
        scale: scale,
        // Align 0m with the same margin the auto-pan uses to avoid a first-frame jump
        originX: PAN_MARGIN_PX,
        originY: canvasHeight / 2
      };
    }
  });

  // Trail history in WORLD units to keep alignment with camera (convert to screen at draw time)
  // Horizontal view: store displacement s (meters). Vertical view: store absolute height h (meters).
  const [trailWorld, setTrailWorld] = useState<number[]>([]);
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
  // Clear trail on reset
  setTrailWorld([]);
    frameCounterRef.current = 0;
    // Clear graph data on reset
    graphDataRef.current = [];
    lastCaptureTimeRef.current = 0;
    
    // Reset viewport to initial position based on view mode
    const canvasWidth = 800;
    const canvasHeight = 400;
  const motionRange = effectiveMaxDisp - effectiveMinDisp;
    
    if (viewMode === 'horizontal') {
      const newScale = motionRange > 0 ? (canvasWidth * 0.8) / motionRange : 10;
      setViewport({
        scale: newScale,
        // Keep the same margin used by auto-pan so 0m is stable pre/post Start
        originX: PAN_MARGIN_PX,
        originY: canvasHeight / 2
      });
    } else {
      const newScale = motionRange > 0 ? ((canvasHeight - 80) * 0.8) / motionRange : 10;
      // Keep initial object within margins at t=0
      const groundY = canvasHeight - 40;
      const neutralY = groundY - (simulationParams.height * newScale);
      const desiredY = clamp(neutralY, PAN_MARGIN_PX, canvasHeight - PAN_MARGIN_PX);
      const originYOffset = desiredY - neutralY;
      setViewport({
        scale: newScale,
        originX: 110,
        originY: canvasHeight / 2 + originYOffset,
      });
    }
    
    // Invalidate background cache to force redraw with new settings
    backgroundCacheValidRef.current = false;
  }, [resetKey, onUpdatePhysics, viewMode, effectiveMaxDisp, effectiveMinDisp, simulationParams.height]);

  // Update viewport when motion bounds change (use useLayoutEffect for synchronous updates)
  useLayoutEffect(() => {
    const canvasWidth = 800;  // matches canvas width
    const canvasHeight = 400; // matches canvas height
    
    // Calculate the range of motion
    const motionRange = maxDisplacement - minDisplacement;
    
    // Handle edge case where there's no motion (duration = 0 or very small)
    if (motionRange === 0 || !isFinite(motionRange)) {
      if (viewMode === 'horizontal') {
        setViewport({
          scale: 10,
          originX: 80,
          originY: canvasHeight / 2
        });
      } else {
        setViewport({
          scale: 10,
          originX: 110,
          originY: canvasHeight / 2
        });
      }
      // Invalidate background cache
      backgroundCacheValidRef.current = false;
      return;
    }
    
    if (viewMode === 'horizontal') {
      // Horizontal mode: fit motion in 80% of canvas width
      const newScale = (canvasWidth * 0.8) / motionRange;
      
      // Calculate origin X to position 0m at about 10% from left edge
      // The starting position (displacement = 0) should be at PAN_MARGIN_PX from the left
      const startPositionX = PAN_MARGIN_PX;
      const newOriginX = startPositionX;
      
      // Keep Y centered vertically
      const newOriginY = canvasHeight / 2;
      
      setViewport({
        scale: newScale,
        originX: newOriginX,
        originY: newOriginY
      });
    } else {
      // Vertical mode: fit motion in 80% of canvas height
      // Use absolute heights across the motion (initial height + displacement)
      const minHeightAbs = Math.max(0, simulationParams.height + minDisplacement);
      const maxHeightAbs = Math.max(minHeightAbs, simulationParams.height + maxDisplacement);
      const heightRange = Math.max(0.0001, maxHeightAbs - minHeightAbs);
      
      // Calculate scale to fit the height range
      const usableHeight = canvasHeight - 80;
      const newScale = heightRange > 0 ? (usableHeight * 0.8) / heightRange : 10;

      // Choose originY so that initial object (t=0) is within safe margins to prevent jump
      const groundY = canvasHeight - 40;
  const neutralY = groundY - (simulationParams.height * newScale);
  const desiredY = clamp(neutralY, PAN_MARGIN_PX, canvasHeight - PAN_MARGIN_PX);
      const originYOffset = desiredY - neutralY;

      const newOriginX = 110;
      const newOriginY = canvasHeight / 2 + originYOffset;

      setViewport({
        scale: newScale,
        originX: newOriginX,
        originY: newOriginY,
      });
    }
    
    // Invalidate background cache when viewport changes
    backgroundCacheValidRef.current = false;
  }, [effectiveMinDisp, effectiveMaxDisp, viewMode, simulationParams.height, resetKey, minDisplacement, maxDisplacement]);

  // Update function called on each frame
  const update = useCallback((deltaTime: number) => {
    // Increment simulation time and clamp to the configured duration for accuracy
    const targetTime = physicsStateRef.current.time + deltaTime;
    const clampedTime = Math.min(targetTime, simulationParams.duration);
    const finished = clampedTime >= simulationParams.duration;

    // Calculate new physics values using the clamped time
    const newVelocity = calculateVelocity(simulationParams.u, simulationParams.a, clampedTime);
    const newDisplacement = calculateDisplacement(simulationParams.u, simulationParams.a, clampedTime);

    // Update the physics state with the precise time value
    onUpdatePhysics({
      time: clampedTime,
      velocity: newVelocity,
      displacement: newDisplacement
    });

    // Collect data for graphs at fixed intervals (always include the final point)
    if (clampedTime - lastCaptureTimeRef.current >= DATA_CAPTURE_INTERVAL || finished) {
      graphDataRef.current.push({
        t: clampedTime,
        v: newVelocity,
        s: newDisplacement
      });
      lastCaptureTimeRef.current = clampedTime;
    }

    // Dynamic viewport adjustment to keep object in view
    const canvasWidth = 800;
    const canvasHeight = 400;
  const margin = PAN_MARGIN_PX; // pixels from edge before panning

    if (viewMode === 'horizontal') {
      const objectScreenX = viewport.originX + newDisplacement * viewport.scale;
      
      // Pan right if object is too close to right edge
      if (objectScreenX > canvasWidth - margin) {
        setViewport(prev => ({
          ...prev,
          originX: prev.originX - (objectScreenX - (canvasWidth - margin))
        }));
        backgroundCacheValidRef.current = false;
      }
      // Pan left if object is too close to left edge
      else if (objectScreenX < margin) {
        setViewport(prev => ({
          ...prev,
          originX: prev.originX + (margin - objectScreenX)
        }));
        backgroundCacheValidRef.current = false;
      }
    } else {
      // Vertical mode
      const currentHeight = simulationParams.height + newDisplacement;
      const offsetY = viewport.originY - canvasHeight / 2;
      const groundY = canvasHeight - 40 + offsetY;
      const objectScreenY = groundY - (currentHeight * viewport.scale);
      
      // Pan up if object is too close to top edge
      if (objectScreenY < margin) {
        setViewport(prev => ({
          ...prev,
          originY: prev.originY + (margin - objectScreenY)
        }));
        backgroundCacheValidRef.current = false;
      }
      // Pan down if object is too close to bottom edge
      else if (objectScreenY > canvasHeight - margin) {
        setViewport(prev => ({
          ...prev,
          originY: prev.originY - (objectScreenY - (canvasHeight - margin))
        }));
        backgroundCacheValidRef.current = false;
      }
    }

    // Update trail history in WORLD units (every 3 frames)
    frameCounterRef.current++;
    if (frameCounterRef.current % 3 === 0 || finished) {
      if (viewMode === 'horizontal') {
        setTrailWorld((prev) => [...prev, newDisplacement]);
      } else {
        const currentHeight = simulationParams.height + newDisplacement;
        setTrailWorld((prev) => [...prev, currentHeight]);
      }
    }
    
    if (finished) {
      setIsRunning(false);
      onSimulationEnd(graphDataRef.current);
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

    // Draw position trail (convert WORLD to SCREEN using current viewport so it follows the camera)
    if (trailWorld.length > 0) {
      if (viewMode === 'horizontal') {
        trailWorld.forEach((s) => {
          const x = viewport.originX + s * viewport.scale;
          const y = viewport.originY;
          ctx.fillStyle = 'rgba(100, 100, 255, 0.6)';
          ctx.beginPath();
          ctx.arc(x, y, 3, 0, Math.PI * 2);
          ctx.fill();
        });
      } else {
        const offsetY = viewport.originY - canvas.height / 2;
        const groundY = canvas.height - 40 + offsetY;
        trailWorld.forEach((h) => {
          const x = 80 + 30; // same fixed X as the object in vertical mode
          const y = groundY - (h * viewport.scale);
          ctx.fillStyle = 'rgba(100, 100, 255, 0.6)';
          ctx.beginPath();
          ctx.arc(x, y, 3, 0, Math.PI * 2);
          ctx.fill();
        });
      }
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
      const offsetY = viewport.originY - canvas.height / 2;
      const groundY = canvas.height - 40 + offsetY;
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
  }, [physicsState, viewport, minDisplacement, maxDisplacement, viewMode, simulationParams.height, objectType, trailWorld, markerInterval]);

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
    
    // Draw ground (follow camera originY so environment and markers stay aligned)
    const offsetY = viewport.originY - canvas.height / 2;
    const groundY = canvas.height - 40 + offsetY;
    ctx.fillStyle = '#8B7355';
    ctx.fillRect(80, groundY, canvas.width - 80, canvas.height - groundY);
    
    // Ground line
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
    // Always start from 0 and extend in both directions to cover the visible area
    const start = Math.floor(minDisplacement / markerInterval) * markerInterval;
    const end = Math.ceil(maxDisplacement / markerInterval) * markerInterval;
    
    // Ensure we always include 0
    const actualStart = Math.min(start, 0);
    const actualEnd = Math.max(end, 0);
    
    for (let displacement = actualStart; displacement <= actualEnd; displacement += markerInterval) {
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
    // Vertical mode - calculate the range of heights we need to show
    // minDisplacement and maxDisplacement are the range of vertical displacement
    // We need to add the initial height to get absolute heights
    const minHeight = height + minDisplacement;
    const maxHeight = height + maxDisplacement;
    
    const heightStart = Math.floor(Math.min(minHeight, 0) / markerInterval) * markerInterval;
    const heightEnd = Math.ceil(Math.max(maxHeight, 0) / markerInterval) * markerInterval;
    
    // Only render marks that could fall within (or slightly outside) the viewport
    const offsetY = viewport.originY - canvas.height / 2;
    const groundY = canvas.height - 40 + offsetY;
    const pad = 60; // extra padding so near-edge labels still render
    for (let h = heightStart; h <= heightEnd; h += markerInterval) {
      const screenY = groundY - (h * viewport.scale);
      
      if (screenY >= -pad && screenY <= canvas.height + pad) {
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
