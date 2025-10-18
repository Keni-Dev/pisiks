import { Timer, Wind, Ruler, Gauge } from 'lucide-react';
import DataRow from './ui/DataRow';
import type { PhysicsState } from '../lib/physics';
import { mpsToKph, mToKm } from '../lib/physics';

interface DataPanelProps {
  physicsState: PhysicsState;
  simulationParams: {
    u: number;  // initial velocity (m/s)
    a: number;  // acceleration (m/s²)
    duration: number;  // total simulation time (s)
  };
  displayUnits: {
    velocity: 'm/s' | 'km/h';
    distance: 'm' | 'km';
  };
}

export default function DataPanel({ physicsState, simulationParams, displayUnits }: DataPanelProps) {
  // Calculate converted values for velocity
  const velocityValue = displayUnits.velocity === 'km/h' 
    ? mpsToKph(physicsState.velocity) 
    : physicsState.velocity;
  const velocitySecondaryValue = displayUnits.velocity === 'km/h' 
    ? physicsState.velocity 
    : undefined;

  // Calculate converted values for displacement
  const displacementValue = displayUnits.distance === 'km' 
    ? mToKm(physicsState.displacement) 
    : physicsState.displacement;
  const displacementSecondaryValue = displayUnits.distance === 'km' 
    ? physicsState.displacement 
    : undefined;

  return (
    <div className="bg-white rounded-lg shadow-md border border-slate-200 p-6 h-full">
      <h2 className="text-xl font-semibold text-slate-800 mb-6">Physics Data</h2>
      <div className="space-y-1">
        <DataRow 
          icon={Timer}
          label="Time"
          value={physicsState.time}
          unit="seconds"
        />
        <DataRow 
          icon={Wind}
          label="Velocity"
          value={velocityValue}
          unit={displayUnits.velocity}
          secondaryValue={velocitySecondaryValue}
          secondaryUnit={velocitySecondaryValue !== undefined ? 'm/s' : undefined}
        />
        <DataRow 
          icon={Ruler}
          label="Displacement"
          value={displacementValue}
          unit={displayUnits.distance === 'km' ? 'km' : 'meters'}
          secondaryValue={displacementSecondaryValue}
          secondaryUnit={displacementSecondaryValue !== undefined ? 'm' : undefined}
        />
        <DataRow 
          icon={Gauge}
          label="Acceleration"
          value={simulationParams.a}
          unit="m/s²"
        />
      </div>
    </div>
  );
}

