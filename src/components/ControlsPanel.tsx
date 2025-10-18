import { useState } from 'react';
import { Play, Pause, RefreshCw } from 'lucide-react';
import SliderInput from './ui/SliderInput';
import RadioGroup from './ui/RadioGroup';

interface ControlsPanelProps {
  simulationParams: {
    u: number;
    a: number;
    duration: number;
  };
  setSimulationParams: (params: { u: number; a: number; duration: number }) => void;
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

type MotionType = 'uniform' | 'accelerated' | 'freefall';

export default function ControlsPanel({
  simulationParams,
  setSimulationParams,
  isRunning,
  onStart,
  onPause,
  onReset
}: ControlsPanelProps) {
  const [motionType, setMotionType] = useState<MotionType>('accelerated');

  const motionTypeOptions = [
    { value: 'uniform', label: 'Uniform' },
    { value: 'accelerated', label: 'Accelerated' },
    { value: 'freefall', label: 'Free Fall' }
  ];

  const handleMotionTypeChange = (value: string) => {
    const newMotionType = value as MotionType;
    setMotionType(newMotionType);

    // Update acceleration based on motion type
    if (newMotionType === 'uniform') {
      setSimulationParams({ ...simulationParams, a: 0 });
    } else if (newMotionType === 'freefall') {
      setSimulationParams({ ...simulationParams, a: 9.8 });
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
