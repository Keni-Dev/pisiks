/**
 * Core physics formulas and types for kinematics calculations
 */

/**
 * Represents the state of a physics simulation at a given time
 */
export interface PhysicsState {
  /** Time elapsed in seconds */
  time: number;
  /** Velocity in meters per second (m/s) */
  velocity: number;
  /** Displacement in meters (m) */
  displacement: number;
}

/**
 * Gravitational acceleration constant (m/s²)
 */
export const GRAVITY = 9.8;

/**
 * Calculates velocity using the kinematic equation: v = u + at
 * 
 * @param initialVelocity - Initial velocity (u) in m/s
 * @param acceleration - Acceleration (a) in m/s²
 * @param time - Time elapsed (t) in seconds
 * @returns Final velocity (v) in m/s
 */
export function calculateVelocity(
  initialVelocity: number,
  acceleration: number,
  time: number
): number {
  return initialVelocity + acceleration * time;
}

/**
 * Calculates displacement using the kinematic equation: s = ut + ½at²
 * 
 * @param initialVelocity - Initial velocity (u) in m/s
 * @param acceleration - Acceleration (a) in m/s²
 * @param time - Time elapsed (t) in seconds
 * @returns Displacement (s) in meters
 */
export function calculateDisplacement(
  initialVelocity: number,
  acceleration: number,
  time: number
): number {
  return initialVelocity * time + 0.5 * acceleration * time * time;
}

/**
 * Converts velocity from meters per second to kilometers per hour
 * 
 * @param mps - Velocity in meters per second
 * @returns Velocity in kilometers per hour
 */
export function mpsToKph(mps: number): number {
  return mps * 3.6;
}

/**
 * Converts distance from meters to kilometers
 * 
 * @param m - Distance in meters
 * @returns Distance in kilometers
 */
export function mToKm(m: number): number {
  return m / 1000;
}

/**
 * Calculates the minimum and maximum displacement for a motion
 * 
 * @param initialVelocity - Initial velocity (u) in m/s
 * @param acceleration - Acceleration (a) in m/s²
 * @param duration - Total time duration in seconds
 * @returns Object with minDisplacement and maxDisplacement in meters
 */
export function calculateMotionBounds(
  initialVelocity: number,
  acceleration: number,
  duration: number
): { minDisplacement: number; maxDisplacement: number } {
  // Always include displacement at t=0 (which is 0)
  const displacements = [0];

  // Include displacement at final time
  const finalDisplacement = calculateDisplacement(initialVelocity, acceleration, duration);
  displacements.push(finalDisplacement);

  // Check if velocity changes sign (turning point) during the simulation
  // This happens when acceleration and initial velocity have opposite signs
  // and velocity becomes zero at time t = -u/a
  if (acceleration !== 0) {
    const turningPointTime = -initialVelocity / acceleration;
    
    // Only consider turning point if it's within the simulation duration
    if (turningPointTime > 0 && turningPointTime < duration) {
      const turningPointDisplacement = calculateDisplacement(
        initialVelocity,
        acceleration,
        turningPointTime
      );
      displacements.push(turningPointDisplacement);
    }
  }

  return {
    minDisplacement: Math.min(...displacements),
    maxDisplacement: Math.max(...displacements)
  };
}
