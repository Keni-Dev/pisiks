export default function ControlsPanel() {
  return (
    <div className="bg-white rounded-lg shadow-md border border-slate-200 p-6 h-full">
      <h2 className="text-xl font-semibold text-slate-800 mb-4">Controls</h2>
      <div className="text-neutral">
        <p className="mb-2">⚙️ Simulation controls will appear here</p>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Initial velocity controls</li>
          <li>Angle adjustment</li>
          <li>Object selection</li>
          <li>Play/Pause/Reset buttons</li>
        </ul>
      </div>
    </div>
  );
}
