export type ObjectType = 'ball' | 'car' | 'rocket';

export interface SimulationParams {
  u: number; // initial velocity (m/s)
  a: number; // acceleration (m/s^2)
  duration: number; // total time (s)
  viewMode: 'horizontal' | 'vertical';
  height: number; // initial height for freefall (m)
  objectType: ObjectType;
}
