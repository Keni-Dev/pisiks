import { useEffect, useRef } from 'react';

type UpdateFunction = (deltaTime: number) => void;

export function useAnimationLoop(update: UpdateFunction) {
  const requestIdRef = useRef<number | undefined>(undefined);
  const previousTimeRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const loop = (time: number) => {
      // Calculate delta time (time since last frame)
      if (previousTimeRef.current !== undefined) {
        const deltaTime = time - previousTimeRef.current;
        update(deltaTime);
      }
      previousTimeRef.current = time;

      // Schedule next frame
      requestIdRef.current = requestAnimationFrame(loop);
    };

    // Start the loop
    requestIdRef.current = requestAnimationFrame(loop);

    // Cleanup: cancel animation frame on unmount
    return () => {
      if (requestIdRef.current) {
        cancelAnimationFrame(requestIdRef.current);
      }
    };
  }, [update]);
}
