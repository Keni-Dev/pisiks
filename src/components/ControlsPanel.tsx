import { useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { Play, Pause, RefreshCw } from 'lucide-react';
import SliderInput from './ui/SliderInput';
import RadioGroup from './ui/RadioGroup';

interface ControlsPanelProps {
  simulationParams: {
    u: number;
    a: number;
    duration: number;
    viewMode: 'horizontal' | 'vertical';
    height: number;
    objectType: 'ball' | 'car' | 'rocket';
  };
  setSimulationParams: Dispatch<SetStateAction<{ u: number; a: number; duration: number; viewMode: 'horizontal' | 'vertical'; height: number; objectType: 'ball' | 'car' | 'rocket' }>>;
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  displayUnits: {
    velocity: 'm/s' | 'km/h';
    distance: 'm' | 'km';
  };
  setDisplayUnits: (units: { velocity: 'm/s' | 'km/h'; distance: 'm' | 'km' }) => void;
}

type MotionType = 'uniform' | 'accelerated' | 'freefall';

export default function ControlsPanel({
  simulationParams,
  setSimulationParams,
  isRunning,
  onStart,
  onPause,
  onReset,
  displayUnits,
  setDisplayUnits
}: ControlsPanelProps) {
  const [motionType, setMotionType] = useState<MotionType>('accelerated');

  const motionTypeOptions = [
    { value: 'uniform', label: 'Uniform' },
    { value: 'accelerated', label: 'Accelerated' },
    { value: 'freefall', label: 'Free Fall' }
  ];

  const objectOptions = [
    { value: 'ball', label: 'Ball' },
    { value: 'car', label: 'Car' },
    { value: 'rocket', label: 'Rocket' }
  ];

  const handleMotionTypeChange = (value: string) => {
    const newMotionType = value as MotionType;
    setMotionType(newMotionType);

    // Update acceleration and view mode based on motion type
    if (newMotionType === 'uniform') {
  // suggest car for uniform motion
  setSimulationParams({ ...simulationParams, a: 0, viewMode: 'horizontal', objectType: simulationParams.objectType || 'car' });
    } else if (newMotionType === 'freefall') {
      // For freefall, acceleration is negative (downward) and initial velocity should be 0 or negative
  // suggest ball for freefall
  setSimulationParams({ ...simulationParams, a: -9.8, u: 0, viewMode: 'vertical', objectType: simulationParams.objectType || 'ball' });
    } else {
  setSimulationParams({ ...simulationParams, viewMode: 'horizontal' });
    }
  };

  const handleVelocityChange = (value: number) => {
    setSimulationParams({ ...simulationParams, u: value });
  };

  const handleAccelerationChange = (value: number) => {
    setSimulationParams({ ...simulationParams, a: value });
  };

  const handleDurationChange = (value: number) => {
    setSimulationParams({ ...simulationParams, duration: value });
  };

  const handleHeightChange = (value: number) => {
    setSimulationParams({ ...simulationParams, height: value });
  };

  const handleObjectChange = (value: string) => {
    const obj = value as 'ball' | 'car' | 'rocket';
    setSimulationParams({ ...simulationParams, objectType: obj });
  };

  const isAccelerationDisabled = motionType === 'uniform' || motionType === 'freefall';

  return (
    <div className="bg-white rounded-lg shadow-md border border-slate-200 p-6 h-full">
      <h2 className="text-xl font-semibold text-slate-800 mb-6">Controls</h2>
      
      <div className="space-y-6">
        {/* Motion Type Selector */}
        <RadioGroup
          label="Motion Type"
          options={motionTypeOptions}
          selectedValue={motionType}
          onChange={handleMotionTypeChange}
        />

        {/* Object Selector */}
        <div>
          <label className="text-sm font-medium text-slate-700">Object</label>
          <div className="mt-2">
            <RadioGroup
              label="Object"
              options={objectOptions}
              selectedValue={simulationParams.objectType}
              onChange={handleObjectChange}
            />
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-200"></div>

        {/* Initial Velocity Slider */}
        <SliderInput
          label="Initial Velocity (u)"
          value={simulationParams.u}
          onChange={handleVelocityChange}
          min={-100}
          max={100}
          step={1}
          unit="m/s"
        />

        {/* Acceleration Slider */}
        <div className={isAccelerationDisabled ? 'opacity-50 pointer-events-none' : ''}>
          <SliderInput
            label="Acceleration (a)"
            value={simulationParams.a}
            onChange={handleAccelerationChange}
            min={-20}
            max={20}
            step={0.1}
            unit="m/s²"
          />
        </div>

        {/* Duration Slider */}
        <SliderInput
          label="Time Duration (t)"
          value={simulationParams.duration}
          onChange={handleDurationChange}
          min={0.1}
          max={60}
          step={0.1}
          unit="s"
        />

        {/* Height Slider - only for freefall */}
        {motionType === 'freefall' && (
          <SliderInput
            label="Initial Height (h)"
            value={simulationParams.height}
            onChange={handleHeightChange}
            min={1}
            max={200}
            step={1}
            unit="m"
          />
        )}

        {/* Divider */}
        <div className="border-t border-slate-200"></div>

        {/* Unit Display Toggles */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-700">Display Units</h3>
          
          {/* Velocity Units Toggle */}
          <div>
            <label className="text-xs text-slate-600 mb-2 block">Velocity</label>
            <div className="flex gap-2">
              <button
                onClick={() => setDisplayUnits({ ...displayUnits, velocity: 'm/s' })}
                className={`
                  flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200
                  ${displayUnits.velocity === 'm/s'
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }
                `}
              >
                m/s
              </button>
              <button
                onClick={() => setDisplayUnits({ ...displayUnits, velocity: 'km/h' })}
                className={`
                  flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200
                  ${displayUnits.velocity === 'km/h'
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }
                `}
              >
                km/h
              </button>
            </div>
          </div>

          {/* Distance Units Toggle */}
          <div>
            <label className="text-xs text-slate-600 mb-2 block">Distance</label>
            <div className="flex gap-2">
              <button
                onClick={() => setDisplayUnits({ ...displayUnits, distance: 'm' })}
                className={`
                  flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200
                  ${displayUnits.distance === 'm'
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }
                `}
              >
                meters
              </button>
              <button
                onClick={() => setDisplayUnits({ ...displayUnits, distance: 'km' })}
                className={`
                  flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200
                  ${displayUnits.distance === 'km'
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }
                `}
              >
                kilometers
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-200"></div>

        {/* Control Buttons */}
        <div className="flex gap-3">
          {/* Start Button */}
          <button
            onClick={onStart}
            disabled={isRunning}
            className={`
              flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md
              font-medium text-sm transition-all duration-200
              ${isRunning
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-orange-500 text-white hover:bg-orange-600 active:bg-orange-700 shadow-sm hover:shadow-md'
              }
            `}
          >
            <Play size={18} />
            Start
          </button>

          {/* Pause Button */}
          <button
            onClick={onPause}
            disabled={!isRunning}
            className={`
              flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md
              font-medium text-sm transition-all duration-200 border
              ${!isRunning
                ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50 hover:border-slate-400 active:bg-slate-100'
              }
            `}
          >
            <Pause size={18} />
            Pause
          </button>

          {/* Reset Button */}
          <button
            onClick={onReset}
            className="
              flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md
              font-medium text-sm transition-all duration-200 border
              bg-white text-slate-700 border-slate-300
              hover:bg-slate-50 hover:border-slate-400 active:bg-slate-100
            "
          >
            <RefreshCw size={18} />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
