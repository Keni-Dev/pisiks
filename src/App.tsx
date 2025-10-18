import Header from './components/Header';
import SimulationCanvas from './components/SimulationCanvas';
import ControlsPanel from './components/ControlsPanel';
import DataPanel from './components/DataPanel';

function App() {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        {/* Simulation Area */}
        <div className="mb-6">
          <SimulationCanvas />
        </div>
        
        {/* Bottom Panel - Controls and Data */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ControlsPanel />
          <DataPanel />
        </div>
      </main>
    </div>
  );
}

export default App;
