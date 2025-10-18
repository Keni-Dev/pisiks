import { useEffect, useRef } from 'react';

type UpdateFunction = (deltaTime: number) => void;

/**
 * Custom hook for creating an animation loop with delta time
 * 
 * @param update - Callback function that receives deltaTime in seconds
 * @param isRunning - Boolean to control whether the animation loop is active
 */
export function useAnimationLoop(update: UpdateFunction, isRunning: boolean) {
  const requestIdRef = useRef<number | undefined>(undefined);
  const lastTimeRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    // Only run the loop if isRunning is true
    if (!isRunning) {
      // Reset the last time when stopped
      lastTimeRef.current = undefined;
      return;
    }

    const loop = (timestamp: number) => {
      // Calculate delta time in seconds
      if (lastTimeRef.current !== undefined) {
        const deltaTime = (timestamp - lastTimeRef.current) / 1000;
        update(deltaTime);
      }
      lastTimeRef.current = timestamp;

      // Schedule next frame
      requestIdRef.current = requestAnimationFrame(loop);
    };

    // Start the loop
    requestIdRef.current = requestAnimationFrame(loop);

    // Cleanup: cancel animation frame when stopped or on unmount
    return () => {
      if (requestIdRef.current) {
        cancelAnimationFrame(requestIdRef.current);
      }
    };
  }, [update, isRunning]);
}
