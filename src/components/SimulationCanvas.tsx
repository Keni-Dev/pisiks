import { useCallback, useRef, useEffect, useState } from 'react';
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

export default function SimulationCanvas({ 
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

  // Data collection for graphs
  const graphDataRef = useRef<GraphDataPoint[]>([]);
  const lastCaptureTimeRef = useRef(0);
  const DATA_CAPTURE_INTERVAL = 0.1; // seconds

  // Use a ref to avoid stale closures in the animation loop
  const physicsStateRef = useRef(physicsState);
  
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
    
    // Handle edge case where there's no motion
    if (motionRange === 0) {
      setViewport({
        scale: 10,
        originX: canvasWidth / 2,
        originY: canvasHeight / 2
      });
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
      // In freefall, the ball starts at height and falls to ground (height=0)
      // So we need to show from 0 to initial height
      const maxHeight = simulationParams.height;
      const minHeight = Math.max(0, maxHeight + minDisplacement); // minDisplacement is negative
      const heightRange = maxHeight - minHeight;
      
      // Calculate scale to fit the height range in 80% of usable canvas height
      const usableHeight = canvasHeight - 80; // Leave room for ground and top margin
      const newScale = heightRange > 0 ? (usableHeight * 0.8) / heightRange : 10;
      
      // X origin doesn't matter much in vertical mode
      const newOriginX = 110; // Ball position from building edge
      
      // Y origin - not used in this mode as we calculate from ground
      const newOriginY = canvasHeight / 2;
      
      setViewport({
        scale: newScale,
        originX: newOriginX,
        originY: newOriginY
      });
    }
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

    // Calculate new physics values using our formulas
    const newVelocity = calculateVelocity(simulationParams.u, simulationParams.a, newTime);
    const newDisplacement = calculateDisplacement(simulationParams.u, simulationParams.a, newTime);

    // Update the physics state via callback
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

    // Update position history for trail effect (every 3 frames to avoid clutter)
    frameCounterRef.current++;
    if (frameCounterRef.current % 3 === 0) {
      // Calculate screen position for trail
      let trailX: number;
      let trailY: number;

      if (viewMode === 'horizontal') {
        trailX = viewport.originX + newDisplacement * viewport.scale;
        trailY = viewport.originY;
      } else {
        const currentHeight = simulationParams.height + newDisplacement;
        trailX = 80 + 30; // offset from building edge
        const groundY = 400 - 40; // canvas height - ground offset
        trailY = groundY - (currentHeight * viewport.scale);
      }

      setPositionHistory((prev) => {
        const newHistory = [...prev, { x: trailX, y: trailY }];
        // Limit to last 50 positions for performance
        return newHistory.slice(-50);
      });
    }
  }, [simulationParams, setIsRunning, onUpdatePhysics, onSimulationEnd, viewport, viewMode]);

  // Start the animation loop
  useAnimationLoop(update, isRunning);

  const draw = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    // Helper function to calculate appropriate marker interval
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

    // Helper function to draw distance markers
    const drawMarkers = (
      viewport: { scale: number; originX: number; originY: number },
      viewMode: 'horizontal' | 'vertical'
    ) => {
      const markerInterval = calculateMarkerInterval(viewport.scale);
      
      if (viewMode === 'horizontal') {
        const start = Math.floor(minDisplacement / markerInterval) * markerInterval;
        const end = Math.ceil(maxDisplacement / markerInterval) * markerInterval;
        
        for (let displacement = start; displacement <= end; displacement += markerInterval) {
          const screenX = viewport.originX + displacement * viewport.scale;
          
          if (screenX >= 0 && screenX <= canvas.width) {
            // Draw tick mark with thicker line
            const tickY = viewport.originY;
            ctx.strokeStyle = '#1E293B';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(screenX, tickY - 15);
            ctx.lineTo(screenX, tickY + 15);
            ctx.stroke();
            
            // Draw label with background for better visibility
            const label = `${displacement}m`;
            ctx.font = 'bold 14px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            
            // Measure text for background
            const metrics = ctx.measureText(label);
            const textWidth = metrics.width;
            const textHeight = 16;
            const padding = 4;
            
            // Draw white background with border
            ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
            ctx.strokeStyle = '#CBD5E1';
            ctx.lineWidth = 1;
            const bgX = screenX - textWidth / 2 - padding;
            const bgY = tickY + 20;
            ctx.fillRect(bgX, bgY, textWidth + padding * 2, textHeight + padding * 2);
            ctx.strokeRect(bgX, bgY, textWidth + padding * 2, textHeight + padding * 2);
            
            // Draw label text
            ctx.fillStyle = '#0F172A';
            ctx.fillText(label, screenX, tickY + 20 + padding);
          }
        }
      } else {
        // Vertical mode - show height markers from ground
        // We want to mark heights (0m, 10m, 20m, etc.) not displacement
        // Calculate which heights to show based on the initial height
        const maxHeight = simulationParams.height;
        const heightStart = 0;
        const heightEnd = Math.ceil(maxHeight / markerInterval) * markerInterval;
        
        for (let height = heightStart; height <= heightEnd; height += markerInterval) {
          const groundY = canvas.height - 40;
          const screenY = groundY - (height * viewport.scale);
          
          if (screenY >= 0 && screenY <= canvas.height) {
            // Draw tick mark with thicker line
            const tickX = 60;
            ctx.strokeStyle = '#1E293B';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(tickX - 8, screenY);
            ctx.lineTo(tickX + 8, screenY);
            ctx.stroke();
            
            // Draw label with background
            const label = `${height}m`;
            ctx.font = 'bold 14px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
            ctx.textAlign = 'right';
            ctx.textBaseline = 'middle';
            
            // Measure text for background
            const metrics = ctx.measureText(label);
            const textWidth = metrics.width;
            const textHeight = 16;
            const padding = 4;
            
            // Draw white background with border
            ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
            ctx.strokeStyle = '#CBD5E1';
            ctx.lineWidth = 1;
            const bgX = tickX - 15 - textWidth - padding * 2;
            const bgY = screenY - textHeight / 2 - padding;
            ctx.fillRect(bgX, bgY, textWidth + padding * 2, textHeight + padding * 2);
            ctx.strokeRect(bgX, bgY, textWidth + padding * 2, textHeight + padding * 2);
            
            // Draw label text
            ctx.fillStyle = '#0F172A';
            ctx.fillText(label, tickX - 15 - padding, screenY);
          }
        }
      }
    };

    // Helper function to draw environment
    const drawEnvironment = (
      viewport: { scale: number; originX: number; originY: number },
      viewMode: 'horizontal' | 'vertical'
    ) => {
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
        // Vertical mode - draw building/cliff on the left
        ctx.fillStyle = '#6B4423';
        ctx.fillRect(0, 0, 80, canvas.height);
        
        // Draw building edge
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
        
        // Draw ground at bottom
        const groundY = canvas.height - 40;
        ctx.fillStyle = '#8B7355';
        ctx.fillRect(80, groundY, canvas.width - 80, 40);
        
        // Draw ground line
        ctx.strokeStyle = '#4A3728';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(80, groundY);
        ctx.lineTo(canvas.width, groundY);
        ctx.stroke();
      }
    };

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw environment first
    drawEnvironment(viewport, viewMode);
    
    // Draw distance markers
    drawMarkers(viewport, viewMode);

    // Draw position trail (before the main object)
    if (positionHistory.length > 0) {
      positionHistory.forEach((pos, index) => {
        // Calculate opacity fade: older positions are more transparent
        const age = positionHistory.length - index;
        const opacity = Math.max(0.05, 1 - (age / positionHistory.length));
        
        // Draw trail dot
        ctx.fillStyle = `rgba(100, 100, 255, ${opacity * 0.4})`;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 3, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // Calculate object's screen position using viewport transformation
    let screenX: number;
    let screenY: number;
    
    if (viewMode === 'horizontal') {
      screenX = viewport.originX + physicsState.displacement * viewport.scale;
      screenY = viewport.originY;
    } else {
      // Vertical mode - object starts at initial height and falls downward
      // Initial height is stored in simulationParams.height
      // Displacement is negative as object falls, so actual height = initialHeight + displacement
      const currentHeight = simulationParams.height + physicsState.displacement;
      
      screenX = 80 + 30; // offset from building edge
      // We need to position the object based on absolute height from ground
      // Ground is at canvas bottom, so we measure from there
      const groundY = canvas.height - 40; // Ground position
      screenY = groundY - (currentHeight * viewport.scale);
    }

    // Calculate velocity-based scaling
    // Define a reasonable max velocity for scaling purposes (e.g., 50 m/s)
    const MAX_VELOCITY = 50;
    const velocityMagnitude = Math.abs(physicsState.velocity);
    const sizeScale = 1 + Math.min(velocityMagnitude / MAX_VELOCITY, 1) * 0.3;

    // Draw the object at its current position using the selected objectType
    const drawType = objectType ?? 'ball';
    const objX = screenX;
    const objY = screenY;

    // Calculate rotation for rocket based on velocity direction
    let rotation = 0;
    if (drawType === 'rocket') {
      if (viewMode === 'horizontal') {
        // Horizontal: rocket points in direction of motion
        // velocity > 0 (moving right): rotate 90° (π/2)
        // velocity < 0 (moving left): rotate -90° (-π/2)
        // velocity = 0: point up (0°)
        if (physicsState.velocity > 0.1) {
          rotation = Math.PI / 2; // Point right
        } else if (physicsState.velocity < -0.1) {
          rotation = -Math.PI / 2; // Point left
        }
      } else {
        // Vertical: rocket points in direction of motion (up or down)
        // Note: In freefall, negative velocity means falling (downward motion)
        // Positive velocity would be upward motion
        if (physicsState.velocity < -0.1) {
          rotation = Math.PI; // Point down (falling)
        } else if (physicsState.velocity > 0.1) {
          rotation = 0; // Point up (moving upward)
        }
      }
    }

    // Use switch statement to call appropriate drawing function with velocity scaling
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
        // Fallback to ball if unknown type
        drawBall(ctx, objX, objY, 12 * sizeScale, '#ff6b6b');
    }
  }, [physicsState, viewport, minDisplacement, maxDisplacement, viewMode, simulationParams.height, objectType, positionHistory]);

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
