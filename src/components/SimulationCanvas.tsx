import { useCallback, useRef, useEffect, useState } from 'react';
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
    height: number;  // initial height for freefall (m)
  };
  resetKey: number;
  physicsState: PhysicsState;
  onUpdatePhysics: (newState: PhysicsState) => void;
  minDisplacement: number;
  maxDisplacement: number;
  viewMode: 'horizontal' | 'vertical';
}

export default function SimulationCanvas({ 
  isRunning, 
  setIsRunning, 
  simulationParams, 
  resetKey, 
  physicsState,
  onUpdatePhysics,
  minDisplacement,
  maxDisplacement,
  viewMode
}: SimulationCanvasProps) {
  // Viewport state for zoom and pan
  const [viewport, setViewport] = useState({
    scale: 10,      // pixels per meter
    originX: 50,    // x position of physics origin (0,0) in pixels
    originY: 200    // y position of physics origin (0,0) in pixels
  });

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
  }, [resetKey, onUpdatePhysics]);

  // Reset physics state when simulation stops
  useEffect(() => {
    if (!isRunning) {
      onUpdatePhysics({
        time: 0,
        velocity: 0,
        displacement: 0
      });
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
  }, [simulationParams, setIsRunning, onUpdatePhysics]);

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

    // Calculate ball's screen position using viewport transformation
    let screenX: number;
    let screenY: number;
    
    if (viewMode === 'horizontal') {
      screenX = viewport.originX + physicsState.displacement * viewport.scale;
      screenY = viewport.originY;
    } else {
      // Vertical mode - ball starts at initial height and falls downward
      // Initial height is stored in simulationParams.height
      // Displacement is negative as ball falls, so actual height = initialHeight + displacement
      const currentHeight = simulationParams.height + physicsState.displacement;
      
      screenX = 80 + 30; // offset from building edge
      // We need to position the ball based on absolute height from ground
      // Ground is at canvas bottom, so we measure from there
      const groundY = canvas.height - 40; // Ground position
      screenY = groundY - (currentHeight * viewport.scale);
    }

    // Draw the ball at its current position
    const radius = 15; // 30px diameter = 15px radius

    ctx.beginPath();
    ctx.arc(screenX, screenY, radius, 0, 2 * Math.PI);
    ctx.fillStyle = '#FB923C'; // Orange color (Tailwind orange-400)
    ctx.fill();
    
    // Add a stroke to make the ball more visible
    ctx.strokeStyle = '#EA580C';
    ctx.lineWidth = 2;
    ctx.stroke();
  }, [physicsState, viewport, minDisplacement, maxDisplacement, viewMode, simulationParams.height]);

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
