import { memo } from 'react';
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

const DataPanel = memo(function DataPanel({ physicsState, simulationParams, displayUnits }: DataPanelProps) {
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

  // Create a screen reader-friendly announcement
  const liveRegionText = `Time: ${physicsState.time.toFixed(2)} seconds, Velocity: ${velocityValue.toFixed(2)} ${displayUnits.velocity}, Displacement: ${displacementValue.toFixed(2)} ${displayUnits.distance === 'km' ? 'kilometers' : 'meters'}`;

  return (
    <div className="bg-white rounded-lg shadow-md border border-slate-200 p-4 h-full">
      <h2 className="text-lg font-semibold text-slate-800 mb-3">Physics Data</h2>
      
      {/* Screen reader live region for announcing data changes */}
      <div 
        className="sr-only" 
        role="status" 
        aria-live="polite" 
        aria-atomic="true"
      >
        {liveRegionText}
      </div>

      <div className="space-y-0.5" aria-label="Real-time physics data">
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
});

export default DataPanel;

