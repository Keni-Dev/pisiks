import { memo } from 'react';
import { Timer, Wind, Ruler, Gauge } from 'lucide-react';
import type { PhysicsState } from '../lib/physics';
import { mpsToKph, mToKm } from '../lib/physics';

interface CompactDataDisplayProps {
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
  variant?: 'overlay' | 'side' | 'bottom';
}

const CompactDataDisplay = memo(function CompactDataDisplay({ 
  physicsState, 
  simulationParams, 
  displayUnits,
  variant = 'side'
}: CompactDataDisplayProps) {
  // Calculate converted values for velocity
  const velocityValue = displayUnits.velocity === 'km/h' 
    ? mpsToKph(physicsState.velocity) 
    : physicsState.velocity;

  // Calculate converted values for displacement
  const displacementValue = displayUnits.distance === 'km' 
    ? mToKm(physicsState.displacement) 
    : physicsState.displacement;

  const velocityUnit = displayUnits.velocity;
  const distanceUnit = displayUnits.distance === 'km' ? 'km' : 'm';

  // Different layouts based on variant
  if (variant === 'overlay') {
    return (
      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-slate-200 p-3 text-sm">
        <div className="space-y-1">
          <DataItem icon={Timer} label="Time" value={physicsState.time.toFixed(2)} unit="s" />
          <DataItem icon={Wind} label="Velocity" value={velocityValue.toFixed(2)} unit={velocityUnit} />
          <DataItem icon={Ruler} label="Displacement" value={displacementValue.toFixed(2)} unit={distanceUnit} />
          <DataItem icon={Gauge} label="Acceleration" value={simulationParams.a.toFixed(2)} unit="m/s²" />
        </div>
      </div>
    );
  }

  if (variant === 'bottom') {
    return (
      <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-md border border-slate-200 p-3">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
          <DataItem icon={Timer} label="Time" value={physicsState.time.toFixed(2)} unit="s" compact />
          <DataItem icon={Wind} label="Velocity" value={velocityValue.toFixed(2)} unit={velocityUnit} compact />
          <DataItem icon={Ruler} label="Displacement" value={displacementValue.toFixed(2)} unit={distanceUnit} compact />
          <DataItem icon={Gauge} label="Acceleration" value={simulationParams.a.toFixed(2)} unit="m/s²" compact />
        </div>
      </div>
    );
  }

  // side variant (default)
  return (
    <div className="bg-white rounded-lg shadow-md border border-slate-200 p-4 h-full">
      <h3 className="text-base font-semibold text-slate-800 mb-3">Physics Data</h3>
      <div className="space-y-2 text-sm">
        <DataItem icon={Timer} label="Time" value={physicsState.time.toFixed(2)} unit="s" />
        <DataItem icon={Wind} label="Velocity" value={velocityValue.toFixed(2)} unit={velocityUnit} />
        <DataItem icon={Ruler} label="Displacement" value={displacementValue.toFixed(2)} unit={distanceUnit} />
        <DataItem icon={Gauge} label="Acceleration" value={simulationParams.a.toFixed(2)} unit="m/s²" />
      </div>
    </div>
  );
});

interface DataItemProps {
  icon: React.ElementType;
  label: string;
  value: string;
  unit: string;
  compact?: boolean;
}

function DataItem({ icon: Icon, label, value, unit, compact = false }: DataItemProps) {
  if (compact) {
    return (
      <div className="flex flex-col items-center text-center">
        <Icon className="w-4 h-4 text-slate-500 mb-1" />
        <div className="text-xs text-slate-600 font-medium">{label}</div>
        <div className="font-bold text-slate-900">
          {value} <span className="text-xs font-normal text-slate-500">{unit}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Icon className="w-4 h-4 text-slate-500 flex-shrink-0" />
      <div className="flex-1 flex items-baseline justify-between">
        <span className="text-slate-600 font-medium">{label}:</span>
        <span className="font-bold text-slate-900">
          {value} <span className="text-xs font-normal text-slate-500">{unit}</span>
        </span>
      </div>
    </div>
  );
}

export default CompactDataDisplay;
