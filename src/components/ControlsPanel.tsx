import { useState, useEffect, memo } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { Play, Pause, RefreshCw } from 'lucide-react';
import SliderInput from './ui/SliderInput';
import { presets, type Preset } from '../lib/presets';
import { CollapsibleSection } from './ui/CollapsibleSection';
import type { LayoutMode } from './Header';

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
  layoutMode?: LayoutMode;
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
  setDisplayUnits,
  layoutMode
}: ControlsPanelProps) {
  const [motionType, setMotionType] = useState<MotionType>('accelerated');
  const [activePresetName, setActivePresetName] = useState<string | null>(null);
  const isStandaloneLayout = layoutMode === 'side-by-side' || layoutMode === 'overlay';
  const showSidePresetColumn = layoutMode === 'classic';
  const sliderGridColumns = showSidePresetColumn ? 'grid-cols-1 2xl:grid-cols-2' : 'grid-cols-1 md:grid-cols-2';

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
    <div className={`bg-white rounded-lg shadow-md border border-slate-200 p-4 h-full w-full ${isStandaloneLayout ? 'max-w-4xl mx-auto' : ''}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-800">Controls</h2>
      </div>
      
      <div className="space-y-3">
        {/* Control Buttons - Moved to Top */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={onStart}
            disabled={isRunning}
            aria-label="Start simulation"
            className={`
              flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md
              font-medium text-sm transition-all duration-200
              ${isRunning
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-orange-500 text-white hover:bg-orange-600 active:bg-orange-700 shadow-sm'
              }
            `}
          >
            <Play size={16} />
            Start
          </button>

          <button
            onClick={onPause}
            disabled={!isRunning}
            aria-label="Pause simulation"
            className={`
              flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md
              font-medium text-sm transition-all duration-200 border
              ${!isRunning
                ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }
            `}
          >
            <Pause size={16} />
            Pause
          </button>

          <button
            onClick={onReset}
            aria-label="Reset simulation"
            className="
              flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md
              font-medium text-sm transition-all duration-200 border
              bg-white text-slate-700 border-slate-300
              hover:bg-slate-50
            "
          >
            <RefreshCw size={16} />
            Reset
          </button>
        </div>

        {/* Responsive Grid Layout for Parameters and Presets */}
        <div className={`grid grid-cols-1 gap-3 ${showSidePresetColumn ? 'lg:grid-cols-[minmax(0,1fr)_220px]' : ''}`}>
          {/* Left Column: Parameters and Units */}
          <div className="space-y-3 min-w-0">
            {/* Main Parameters */}
            <CollapsibleSection title="Parameters" defaultOpen={true}>
              <div className="space-y-3">
                {/* Motion Type & Object in compact row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-slate-700 mb-1.5 block">Motion Type</label>
                    <select
                      value={motionType}
                      onChange={(e) => handleMotionTypeChange(e.target.value)}
                      className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      aria-label="Select motion type"
                    >
                      {motionTypeOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium text-slate-700 mb-1.5 block">Object</label>
                    <select
                      value={simulationParams.objectType}
                      onChange={(e) => handleObjectChange(e.target.value)}
                      className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      aria-label="Select object type"
                    >
                      {objectOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Compact Sliders - Better organized on large screens */}
                <div className={`grid gap-x-3 gap-y-4 ${sliderGridColumns}`}>
                  <SliderInput
                    label="Initial Velocity (u)"
                    value={simulationParams.u}
                    onChange={handleVelocityChange}
                    min={-100}
                    max={100}
                    step={1}
                    unit="m/s"
                    tooltip="The starting speed of the object"
                    ariaLabel="Initial velocity in meters per second"
                  />

                  <div className={isAccelerationDisabled ? 'opacity-50 pointer-events-none' : ''}>
                    <SliderInput
                      label="Acceleration (a)"
                      value={simulationParams.a}
                      onChange={handleAccelerationChange}
                      min={-20}
                      max={20}
                      step={0.1}
                      unit="m/s²"
                      tooltip="Rate of change of velocity"
                      ariaLabel="Acceleration in meters per second squared"
                    />
                  </div>

                  <SliderInput
                    label="Duration (t)"
                    value={simulationParams.duration}
                    onChange={handleDurationChange}
                    min={0.1}
                    max={60}
                    step={0.1}
                    unit="s"
                    tooltip="How long the simulation runs"
                    ariaLabel="Simulation duration in seconds"
                  />

                  {motionType === 'freefall' && (
                    <SliderInput
                      label="Initial Height (h)"
                      value={simulationParams.height}
                      onChange={handleHeightChange}
                      min={0}
                      max={200}
                      step={1}
                      unit="m"
                      tooltip="Starting height for the fall"
                      ariaLabel="Initial height in meters"
                    />
                  )}
                </div>
              </div>
            </CollapsibleSection>

            {/* Display Units - Collapsible */}
            <CollapsibleSection title="Display Units" defaultOpen={false}>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-600 mb-1.5 block">Velocity</label>
                  <div className="flex gap-1" role="group" aria-label="Velocity unit selector">
                    <button
                      onClick={() => setDisplayUnits({ ...displayUnits, velocity: 'm/s' })}
                      aria-pressed={displayUnits.velocity === 'm/s'}
                      aria-label="m/s"
                      className={`
                        flex-1 px-2 py-1 text-xs font-medium rounded transition-all
                        ${displayUnits.velocity === 'm/s'
                          ? 'bg-orange-500 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }
                      `}
                    >
                      m/s
                    </button>
                    <button
                      onClick={() => setDisplayUnits({ ...displayUnits, velocity: 'km/h' })}
                      aria-pressed={displayUnits.velocity === 'km/h'}
                      aria-label="km/h"
                      className={`
                        flex-1 px-2 py-1 text-xs font-medium rounded transition-all
                        ${displayUnits.velocity === 'km/h'
                          ? 'bg-orange-500 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }
                      `}
                    >
                      km/h
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-600 mb-1.5 block">Distance</label>
                  <div className="flex gap-1" role="group" aria-label="Distance unit selector">
                    <button
                      onClick={() => setDisplayUnits({ ...displayUnits, distance: 'm' })}
                      aria-pressed={displayUnits.distance === 'm'}
                      aria-label="meters"
                      className={`
                        flex-1 px-2 py-1 text-xs font-medium rounded transition-all
                        ${displayUnits.distance === 'm'
                          ? 'bg-orange-500 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }
                      `}
                    >
                      m
                    </button>
                    <button
                      onClick={() => setDisplayUnits({ ...displayUnits, distance: 'km' })}
                      aria-pressed={displayUnits.distance === 'km'}
                      aria-label="kilometers"
                      className={`
                        flex-1 px-2 py-1 text-xs font-medium rounded transition-all
                        ${displayUnits.distance === 'km'
                          ? 'bg-orange-500 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }
                      `}
                    >
                      km
                    </button>
                  </div>
                </div>
              </div>
            </CollapsibleSection>

            {/* Inline Quick Presets for standalone layouts */}
            {!showSidePresetColumn && (
              <CollapsibleSection title="Quick Presets" defaultOpen={true}>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5" role="group" aria-label="Quick preset scenarios">
                  {presets.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => {
                        handlePresetClick(preset);
                        onReset();
                      }}
                      aria-pressed={activePresetName === preset.name}
                      aria-label={`Load preset: ${preset.name}`}
                      className={`
                        px-2.5 py-1.5 text-xs font-medium rounded-md transition-all duration-200 whitespace-nowrap
                        ${activePresetName === preset.name
                          ? 'bg-orange-500 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                        }
                      `}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </CollapsibleSection>
            )}
          </div>

          {/* Right Column: Quick Presets (side by side on large screens) */}
          {showSidePresetColumn && (
            <div className="lg:min-w-[200px]">
              <CollapsibleSection title="Quick Presets" defaultOpen={true}>
                <div className="grid grid-cols-2 lg:grid-cols-1 gap-1.5" role="group" aria-label="Quick preset scenarios">
                  {presets.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => {
                        handlePresetClick(preset);
                        onReset();
                      }}
                      aria-pressed={activePresetName === preset.name}
                      aria-label={`Load preset: ${preset.name}`}
                      className={`
                        px-2.5 py-1.5 text-xs font-medium rounded-md transition-all duration-200 whitespace-nowrap
                        ${activePresetName === preset.name
                          ? 'bg-orange-500 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                        }
                      `}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </CollapsibleSection>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default ControlsPanel;
