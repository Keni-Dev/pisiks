export default function DataPanel() {
  return (
    <div className="bg-white rounded-lg shadow-md border border-slate-200 p-6 h-full">
      <h2 className="text-xl font-semibold text-slate-800 mb-4">Physics Data</h2>
      <div className="text-neutral">
        <p className="mb-2">📊 Real-time physics data will appear here</p>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Position (x, y)</li>
          <li>Velocity (vx, vy)</li>
          <li>Acceleration</li>
          <li>Time elapsed</li>
          <li>Distance traveled</li>
        </ul>
      </div>
    </div>
  );
}
