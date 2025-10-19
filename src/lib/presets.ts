import type { SimulationParams, ObjectType } from './types';

export interface Preset {
  name: string;
  objectType: ObjectType;
  simulationParams: SimulationParams;
}

export const presets: Preset[] = [
  {
    name: "Car Starting",
    objectType: "car",
    simulationParams: {
      u: 0,           // starting from rest
      a: 3,           // acceleration of 3 m/s²
      duration: 10,   // 10 seconds simulation
      viewMode: 'horizontal',
      height: 0,
      objectType: 'car'
    }
  },
  {
    name: "Car Braking",
    objectType: "car",
    simulationParams: {
      u: 20,          // initial velocity of 20 m/s (72 km/h)
      a: -5,          // deceleration of -5 m/s²
      duration: 4,    // 4 seconds simulation
      viewMode: 'horizontal',
      height: 0,
      objectType: 'car'
    }
  },
  {
    name: "Ball Drop",
    objectType: "ball",
    simulationParams: {
      u: 0,           // dropped from rest
      a: -9.8,        // gravity acceleration (negative = falling down)
      duration: 5,    // 5 seconds simulation
      viewMode: 'vertical',
      height: 100,    // dropped from 100m height
      objectType: 'ball'
    }
  },
  {
    name: "Ball Throw",
    objectType: "ball",
    simulationParams: {
      u: 20,          // thrown upward at 20 m/s (positive for upward)
      a: -9.8,        // gravity acceleration (negative = pulls down)
      duration: 5,    // 5 seconds simulation
      viewMode: 'vertical',
      height: 0,      // thrown from ground level
      objectType: 'ball'
    }
  },
  {
    name: "Rocket Launch",
    objectType: "rocket",
    simulationParams: {
      u: 0,           // starting from rest
      a: 15,          // upward acceleration of 15 m/s² (positive for upward)
      duration: 8,    // 8 seconds simulation
      viewMode: 'vertical',
      height: 0,      // launching from ground
      objectType: 'rocket'
    }
  }
];
