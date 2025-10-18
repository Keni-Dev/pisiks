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
