import { useEffect } from 'react';
import { X, Keyboard, Play, Pause, RefreshCw, Settings } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HelpModal({ isOpen, onClose }: HelpModalProps) {
  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-modal-title"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
          <h2 id="help-modal-title" className="text-2xl font-bold text-slate-800">
            📚 How to Use the Physics Simulator
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500"
            aria-label="Close help modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {/* Quick Start */}
          <section>
            <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <Play size={20} className="text-orange-500" />
              Quick Start
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-slate-700">
              <li>Choose a <strong>Motion Type</strong> (Uniform, Accelerated, or Free Fall)</li>
              <li>Adjust parameters using the sliders or try a <strong>Quick Preset</strong></li>
              <li>Click <strong>Start</strong> to begin the simulation</li>
              <li>Watch the object move and observe the physics data in real-time</li>
              <li>When complete, view the <strong>motion graphs</strong> automatically displayed</li>
            </ol>
          </section>

          {/* Motion Types */}
          <section>
            <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <Settings size={20} className="text-orange-500" />
              Motion Types Explained
            </h3>
            <div className="space-y-3">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-1">Uniform Motion</h4>
                <p className="text-sm text-blue-800">Constant velocity, zero acceleration. The object moves at a steady speed.</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 mb-1">Accelerated Motion</h4>
                <p className="text-sm text-green-800">Variable velocity with constant acceleration. Speed increases or decreases uniformly.</p>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="font-semibold text-purple-900 mb-1">Free Fall</h4>
                <p className="text-sm text-purple-800">Vertical motion under gravity (9.8 m/s²). The object falls downward from a height.</p>
              </div>
            </div>
          </section>

          {/* Parameters */}
          <section>
            <h3 className="text-lg font-semibold text-slate-800 mb-3">Parameter Guide</h3>
            <div className="space-y-2 text-sm">
              <div className="flex gap-3">
                <span className="font-semibold text-slate-700 min-w-[160px]">Initial Velocity (u):</span>
                <span className="text-slate-600">Starting speed of the object in meters per second</span>
              </div>
              <div className="flex gap-3">
                <span className="font-semibold text-slate-700 min-w-[160px]">Acceleration (a):</span>
                <span className="text-slate-600">Rate of change of velocity (positive = speeding up, negative = slowing down)</span>
              </div>
              <div className="flex gap-3">
                <span className="font-semibold text-slate-700 min-w-[160px]">Time Duration (t):</span>
                <span className="text-slate-600">How long the simulation runs in seconds</span>
              </div>
              <div className="flex gap-3">
                <span className="font-semibold text-slate-700 min-w-[160px]">Initial Height (h):</span>
                <span className="text-slate-600">Starting height for free fall motion (only in Free Fall mode)</span>
              </div>
            </div>
          </section>

          {/* Controls */}
          <section>
            <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <Keyboard size={20} className="text-orange-500" />
              Simulation Controls
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                <Play size={20} className="text-green-600 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-800">Start</div>
                  <div className="text-xs text-slate-600">Begin simulation</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                <Pause size={20} className="text-yellow-600 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-800">Pause</div>
                  <div className="text-xs text-slate-600">Freeze motion</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                <RefreshCw size={20} className="text-blue-600 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-800">Reset</div>
                  <div className="text-xs text-slate-600">Return to start</div>
                </div>
              </div>
            </div>
          </section>

          {/* Keyboard Navigation */}
          <section>
            <h3 className="text-lg font-semibold text-slate-800 mb-3">Keyboard Navigation</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex items-center gap-3">
                <kbd className="px-2 py-1 bg-white border border-slate-300 rounded text-xs font-mono">Tab</kbd>
                <span className="text-slate-700">Navigate between controls</span>
              </div>
              <div className="flex items-center gap-3">
                <kbd className="px-2 py-1 bg-white border border-slate-300 rounded text-xs font-mono">Space</kbd>
                <kbd className="px-2 py-1 bg-white border border-slate-300 rounded text-xs font-mono">Enter</kbd>
                <span className="text-slate-700">Activate buttons and radio options</span>
              </div>
              <div className="flex items-center gap-3">
                <kbd className="px-2 py-1 bg-white border border-slate-300 rounded text-xs font-mono">Arrow Keys</kbd>
                <span className="text-slate-700">Adjust slider values</span>
              </div>
              <div className="flex items-center gap-3">
                <kbd className="px-2 py-1 bg-white border border-slate-300 rounded text-xs font-mono">Esc</kbd>
                <span className="text-slate-700">Close modals</span>
              </div>
            </div>
          </section>

          {/* Tips */}
          <section>
            <h3 className="text-lg font-semibold text-slate-800 mb-3">💡 Tips</h3>
            <ul className="list-disc list-inside space-y-1.5 text-sm text-slate-700">
              <li>Try the <strong>Quick Presets</strong> to see common physics scenarios</li>
              <li>Hover over control labels for detailed parameter explanations</li>
              <li>Switch between <strong>m/s and km/h</strong> or <strong>meters and kilometers</strong> for different unit displays</li>
              <li>The simulation automatically stops when the object hits the ground in Free Fall mode</li>
              <li>After simulation, graphs show displacement vs time and velocity vs time</li>
            </ul>
          </section>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-6 py-4 rounded-b-xl">
          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            Got it! Let's explore physics
          </button>
        </div>
      </div>
    </div>
  );
}
