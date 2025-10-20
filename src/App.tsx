import { useState, useEffect, useCallback } from 'react';
import { flushSync } from 'react-dom';
import Header, { type LayoutMode } from './components/Header';
import SimulationCanvas from './components/SimulationCanvas';
import ControlsPanel from './components/ControlsPanel';
import DataPanel from './components/DataPanel';
import CompactDataDisplay from './components/CompactDataDisplay';
import GraphModal from './components/GraphModal';
import HelpModal from './components/HelpModal';
import { LearningPanel } from './components/LearningPanel';
import type { PhysicsState } from './lib/physics';
import type { SimulationParams, GraphDataPoint } from './lib/types';
import { calculateMotionBounds } from './lib/physics';
import type { Preset } from './lib/presets';
// Removed localStorage persistence to avoid control sync issues

// Default simulation parameters
const DEFAULT_PARAMS: SimulationParams = {
  u: 10,  // initial velocity (m/s)
  a: 2,   // acceleration (m/s²)
  duration: 10,  // total simulation time (s)
  viewMode: 'horizontal',
  height: 50,  // initial height for freefall (m)
  objectType: 'ball'
};

function App() {
  const [isRunning, setIsRunning] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [simulationParams, setSimulationParams] = useState<SimulationParams>(DEFAULT_PARAMS);
  const [physicsState, setPhysicsState] = useState<PhysicsState>({
    time: 0,
    velocity: 0,
    displacement: 0
  });
  const [displayUnits, setDisplayUnits] = useState<{
    velocity: 'm/s' | 'km/h';
    distance: 'm' | 'km';
  }>({
    velocity: 'm/s',
    distance: 'm'
  });
  const [motionBounds, setMotionBounds] = useState({
    minDisplacement: 0,
    maxDisplacement: 0
  });
  const [graphData, setGraphData] = useState<GraphDataPoint[]>([]);
  const [isGraphModalOpen, setIsGraphModalOpen] = useState(false);
  const [isLearningPanelOpen, setIsLearningPanelOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  
  // Helper function to get default layout based on screen size
  const getDefaultLayout = (): LayoutMode => {
    return window.innerWidth < 1024 ? 'side-by-side' : 'classic';
  };
  
  // Layout mode - responsive default based on screen size
  const [layoutMode, setLayoutMode] = useState<LayoutMode>(getDefaultLayout());

  // Calculate motion bounds whenever simulation parameters change
  useEffect(() => {
    const bounds = calculateMotionBounds(
      simulationParams.u,
      simulationParams.a,
      simulationParams.duration
    );
    setMotionBounds(bounds);
  }, [simulationParams]);

  const handleStart = useCallback(() => {
    setIsRunning(true);
  }, []);

  const handlePause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const handleReset = useCallback(() => {
    setIsRunning(false);
    setResetKey(prev => prev + 1);
    setPhysicsState({
      time: 0,
      velocity: 0,
      displacement: 0
    });
  }, []);

  const handleLoadPreset = useCallback((preset: Preset) => {
    // Stop any running simulation first
    setIsRunning(false);
    
    // Use flushSync to ensure state updates are applied synchronously
    flushSync(() => {
      // Update simulation parameters with preset values
      setSimulationParams(preset.simulationParams);
      
      // Immediately calculate and set motion bounds for the new preset
      const bounds = calculateMotionBounds(
        preset.simulationParams.u,
        preset.simulationParams.a,
        preset.simulationParams.duration
      );
      setMotionBounds(bounds);
      
      // Reset physics state
      setPhysicsState({
        time: 0,
        velocity: 0,
        displacement: 0
      });
    });
    
    // Increment reset key after all state is flushed
    setResetKey(prev => prev + 1);
  }, [setSimulationParams]);

  const handleUpdatePhysics = useCallback((newState: PhysicsState) => {
    setPhysicsState(newState);
  }, []);

  const handleSimulationEnd = useCallback((data: GraphDataPoint[]) => {
    setGraphData(data);
    setIsGraphModalOpen(true);
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Header */}
      <Header 
        onToggleLearningPanel={() => setIsLearningPanelOpen(!isLearningPanelOpen)}
        onToggleHelpModal={() => setIsHelpModalOpen(!isHelpModalOpen)}
        layoutMode={layoutMode}
        onLayoutChange={setLayoutMode}
      />
      
      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-4">
        {/* CLASSIC LAYOUT - Traditional bottom layout */}
        {layoutMode === 'classic' && (
          <>
            <div className="mb-4">
              <SimulationCanvas 
                isRunning={isRunning}
                setIsRunning={setIsRunning}
                simulationParams={simulationParams}
                resetKey={resetKey}
                physicsState={physicsState}
                onUpdatePhysics={handleUpdatePhysics}
                onSimulationEnd={handleSimulationEnd}
                minDisplacement={motionBounds.minDisplacement}
                maxDisplacement={motionBounds.maxDisplacement}
                viewMode={simulationParams.viewMode}
                objectType={simulationParams.objectType}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ControlsPanel 
                simulationParams={simulationParams}
                setSimulationParams={setSimulationParams}
                isRunning={isRunning}
                onStart={handleStart}
                onPause={handlePause}
                onReset={handleReset}
                onLoadPreset={handleLoadPreset}
                displayUnits={displayUnits}
                setDisplayUnits={setDisplayUnits}
                layoutMode={layoutMode}
              />
              <DataPanel 
                physicsState={physicsState}
                simulationParams={simulationParams}
                displayUnits={displayUnits}
              />
            </div>
          </>
        )}

        {/* SIDE-BY-SIDE LAYOUT - Canvas and data side by side (mobile-friendly) */}
        {layoutMode === 'side-by-side' && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4 mb-4">
              <SimulationCanvas 
                isRunning={isRunning}
                setIsRunning={setIsRunning}
                simulationParams={simulationParams}
                resetKey={resetKey}
                physicsState={physicsState}
                onUpdatePhysics={handleUpdatePhysics}
                onSimulationEnd={handleSimulationEnd}
                minDisplacement={motionBounds.minDisplacement}
                maxDisplacement={motionBounds.maxDisplacement}
                viewMode={simulationParams.viewMode}
                objectType={simulationParams.objectType}
              />
              
              {/* Compact data display on the side or bottom on mobile */}
              <div className="lg:h-[400px]">
                <CompactDataDisplay 
                  physicsState={physicsState}
                  simulationParams={simulationParams}
                  displayUnits={displayUnits}
                  variant="side"
                />
              </div>
            </div>
            
            <ControlsPanel 
              simulationParams={simulationParams}
              setSimulationParams={setSimulationParams}
              isRunning={isRunning}
              onStart={handleStart}
              onPause={handlePause}
              onReset={handleReset}
              onLoadPreset={handleLoadPreset}
              displayUnits={displayUnits}
              setDisplayUnits={setDisplayUnits}
              layoutMode={layoutMode}
            />
          </>
        )}

        {/* OVERLAY LAYOUT - Data overlaid on canvas */}
        {layoutMode === 'overlay' && (
          <>
            <div className="mb-4 relative">
              <SimulationCanvas 
                isRunning={isRunning}
                setIsRunning={setIsRunning}
                simulationParams={simulationParams}
                resetKey={resetKey}
                physicsState={physicsState}
                onUpdatePhysics={handleUpdatePhysics}
                onSimulationEnd={handleSimulationEnd}
                minDisplacement={motionBounds.minDisplacement}
                maxDisplacement={motionBounds.maxDisplacement}
                viewMode={simulationParams.viewMode}
                objectType={simulationParams.objectType}
              />
              
              {/* Overlay data display */}
              <CompactDataDisplay 
                physicsState={physicsState}
                simulationParams={simulationParams}
                displayUnits={displayUnits}
                variant="overlay"
              />
            </div>
            
            <ControlsPanel 
              simulationParams={simulationParams}
              setSimulationParams={setSimulationParams}
              isRunning={isRunning}
              onStart={handleStart}
              onPause={handlePause}
              onReset={handleReset}
              onLoadPreset={handleLoadPreset}
              displayUnits={displayUnits}
              setDisplayUnits={setDisplayUnits}
              layoutMode={layoutMode}
            />
          </>
        )}
      </main>

      {/* Graph Modal */}
      <GraphModal
        isOpen={isGraphModalOpen}
        onClose={() => setIsGraphModalOpen(false)}
        data={graphData}
      />

      {/* Help Modal */}
      <HelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />

      {/* Learning Panel */}
      <LearningPanel
        isOpen={isLearningPanelOpen}
        onClose={() => setIsLearningPanelOpen(false)}
      />
    </div>
  );
}

export default App;
