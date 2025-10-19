import { useState, useEffect, memo } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { Play, Pause, RefreshCw } from 'lucide-react';
import SliderInput from './ui/SliderInput';
import RadioGroup from './ui/RadioGroup';
import { presets, type Preset } from '../lib/presets';

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
  onLoadPreset: (preset: Preset) => void;
  displayUnits: {
    velocity: 'm/s' | 'km/h';
    distance: 'm' | 'km';
  };
  setDisplayUnits: (units: { velocity: 'm/s' | 'km/h'; distance: 'm' | 'km' }) => void;
}

type MotionType = 'uniform' | 'accelerated' | 'freefall';

const ControlsPanel = memo(function ControlsPanel({
  simulationParams,
  setSimulationParams,
  isRunning,
  onStart,
  onPause,
  onReset,
  onLoadPreset,
  displayUnits,
  setDisplayUnits
}: ControlsPanelProps) {
  const [motionType, setMotionType] = useState<MotionType>('accelerated');
  const [activePresetName, setActivePresetName] = useState<string | null>(null);

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
    setActivePresetName(null); // Clear active preset on manual change

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
    setActivePresetName(null); // Clear active preset on manual change
    setSimulationParams({ ...simulationParams, u: value });
  };

  const handleAccelerationChange = (value: number) => {
    setActivePresetName(null); // Clear active preset on manual change
    setSimulationParams({ ...simulationParams, a: value });
  };

  const handleDurationChange = (value: number) => {
    setActivePresetName(null); // Clear active preset on manual change
    setSimulationParams({ ...simulationParams, duration: value });
  };

  const handleHeightChange = (value: number) => {
    setActivePresetName(null); // Clear active preset on manual change
    setSimulationParams({ ...simulationParams, height: value });
  };

  const handleObjectChange = (value: string) => {
    setActivePresetName(null); // Clear active preset on manual change
    const obj = value as 'ball' | 'car' | 'rocket';
    setSimulationParams({ ...simulationParams, objectType: obj });
  };

  const handlePresetClick = (preset: Preset) => {
    setActivePresetName(preset.name);
    onLoadPreset(preset);
    
    // Update motion type based on preset parameters
    if (preset.simulationParams.a === 0) {
      setMotionType('uniform');
    } else if (Math.abs(preset.simulationParams.a - 9.8) < 0.1 || Math.abs(preset.simulationParams.a + 9.8) < 0.1) {
      setMotionType('freefall');
    } else {
      setMotionType('accelerated');
    }
  };

  // Sync motion type with simulation params
  useEffect(() => {
    if (simulationParams.a === 0) {
      setMotionType('uniform');
    } else if (Math.abs(simulationParams.a - 9.8) < 0.1 || Math.abs(simulationParams.a + 9.8) < 0.1) {
      setMotionType('freefall');
    } else {
      setMotionType('accelerated');
    }
  }, [simulationParams.a]);

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
          tooltip="Choose the type of motion to simulate: constant velocity, changing velocity, or falling under gravity"
          ariaLabel="Select motion type for simulation"
        />

        {/* Object Selector */}
        <div>
          <RadioGroup
            label="Object"
            options={objectOptions}
            selectedValue={simulationParams.objectType}
            onChange={handleObjectChange}
            tooltip="Choose which object to animate in the simulation"
            ariaLabel="Select object type for simulation"
          />
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
          tooltip="The starting speed of the object. Positive values move right/up, negative values move left/down."
          ariaLabel="Initial velocity in meters per second"
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
            tooltip="Rate of change of velocity. Positive = speeding up, negative = slowing down. Locked for Uniform and Free Fall modes."
            ariaLabel="Acceleration in meters per second squared"
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
          tooltip="How long the simulation will run in seconds"
          ariaLabel="Simulation duration in seconds"
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
            tooltip="The starting height from which the object falls"
            ariaLabel="Initial height in meters"
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
            <div className="flex gap-2" role="group" aria-label="Velocity unit selector">
              <button
                onClick={() => setDisplayUnits({ ...displayUnits, velocity: 'm/s' })}
                aria-pressed={displayUnits.velocity === 'm/s'}
                aria-label="Display velocity in meters per second"
                className={`
                  flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200
                  ${displayUnits.velocity === 'm/s'
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:shadow-sm'
                  }
                `}
              >
                m/s
              </button>
              <button
                onClick={() => setDisplayUnits({ ...displayUnits, velocity: 'km/h' })}
                aria-pressed={displayUnits.velocity === 'km/h'}
                aria-label="Display velocity in kilometers per hour"
                className={`
                  flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200
                  ${displayUnits.velocity === 'km/h'
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:shadow-sm'
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
            <div className="flex gap-2" role="group" aria-label="Distance unit selector">
              <button
                onClick={() => setDisplayUnits({ ...displayUnits, distance: 'm' })}
                aria-pressed={displayUnits.distance === 'm'}
                aria-label="Display distance in meters"
                className={`
                  flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200
                  ${displayUnits.distance === 'm'
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:shadow-sm'
                  }
                `}
              >
                meters
              </button>
              <button
                onClick={() => setDisplayUnits({ ...displayUnits, distance: 'km' })}
                aria-pressed={displayUnits.distance === 'km'}
                aria-label="Display distance in kilometers"
                className={`
                  flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200
                  ${displayUnits.distance === 'km'
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:shadow-sm'
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

        {/* Quick Presets Section */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-700">Quick Presets</h3>
          <div className="grid grid-cols-2 gap-2" role="group" aria-label="Quick preset scenarios">
            {presets.map((preset) => (
              <button
                key={preset.name}
                onClick={() => handlePresetClick(preset)}
                aria-pressed={activePresetName === preset.name}
                aria-label={`Load preset: ${preset.name}`}
                className={`
                  px-3 py-2 text-xs font-medium rounded-md transition-all duration-200
                  ${activePresetName === preset.name
                    ? 'bg-orange-500 text-white shadow-md ring-2 ring-orange-300 transform scale-[1.02]'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:shadow-sm border border-slate-200 hover:border-slate-300 transform hover:scale-[1.02]'
                  }
                `}
              >
                {preset.name}
              </button>
            ))}
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
            aria-label="Start simulation"
            className={`
              flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md
              font-medium text-sm transition-all duration-200
              ${isRunning
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-orange-500 text-white hover:bg-orange-600 active:bg-orange-700 shadow-sm hover:shadow-md transform hover:scale-[1.02]'
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
            aria-label="Pause simulation"
            className={`
              flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md
              font-medium text-sm transition-all duration-200 border
              ${!isRunning
                ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50 hover:border-slate-400 active:bg-slate-100 hover:shadow-sm transform hover:scale-[1.02]'
              }
            `}
          >
            <Pause size={18} />
            Pause
          </button>

          {/* Reset Button */}
          <button
            onClick={onReset}
            aria-label="Reset simulation to initial state"
            className="
              flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md
              font-medium text-sm transition-all duration-200 border
              bg-white text-slate-700 border-slate-300
              hover:bg-slate-50 hover:border-slate-400 active:bg-slate-100 hover:shadow-sm transform hover:scale-[1.02]
            "
          >
            <RefreshCw size={18} />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
});

export default ControlsPanel;
