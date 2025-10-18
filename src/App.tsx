import { useState } from 'react';
import Header from './components/Header';
import SimulationCanvas from './components/SimulationCanvas';
import ControlsPanel from './components/ControlsPanel';
import DataPanel from './components/DataPanel';

function App() {
  const [isRunning, setIsRunning] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [simulationParams, setSimulationParams] = useState({
    u: 10,  // initial velocity (m/s)
    a: 2,   // acceleration (m/s²)
    duration: 10  // total simulation time (s)
  });

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setResetKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        {/* Simulation Area */}
        <div className="mb-6">
          <SimulationCanvas 
            isRunning={isRunning}
            setIsRunning={setIsRunning}
            simulationParams={simulationParams}
            resetKey={resetKey}
          />
        </div>
        
        {/* Bottom Panel - Controls and Data */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ControlsPanel 
            simulationParams={simulationParams}
            setSimulationParams={setSimulationParams}
            isRunning={isRunning}
            onStart={handleStart}
            onPause={handlePause}
            onReset={handleReset}
          />
          <DataPanel />
        </div>
      </main>
    </div>
  );
}

export default App;
