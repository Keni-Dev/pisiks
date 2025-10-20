import { BookOpen, HelpCircle, Layout, Layers, Monitor } from 'lucide-react';
import lorinzImage from '../imgs/lorinz.jpg';

export type LayoutMode = 'classic' | 'side-by-side' | 'overlay';

interface HeaderProps {
  onToggleLearningPanel: () => void;
  onToggleHelpModal: () => void;
  layoutMode: LayoutMode;
  onLayoutChange: (mode: LayoutMode) => void;
}

export default function Header({ onToggleLearningPanel, onToggleHelpModal, layoutMode, onLayoutChange }: HeaderProps) {
  const layoutOptions: { mode: LayoutMode; icon: React.ElementType; label: string; tooltip: string }[] = [
    { mode: 'side-by-side', icon: Layout, label: 'Side', tooltip: 'Side-by-side layout (mobile-friendly)' },
    { mode: 'overlay', icon: Layers, label: 'Overlay', tooltip: 'Data overlay on canvas' },
    { mode: 'classic', icon: Monitor, label: 'Classic', tooltip: 'Classic bottom layout' },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <img
              src={lorinzImage}
              alt="Lorinz"
              className="w-9 h-9 sm:w-12 sm:h-12 rounded-full object-cover border border-slate-200 shadow-sm flex-shrink-0"
            />
            <h1 className="text-lg sm:text-2xl font-bold text-slate-800 truncate">
              PISIKS SIMULATION FOR MA'AM ROSE
            </h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Layout Switcher */}
          <div className="flex items-center bg-slate-100 rounded-lg p-1 border border-slate-300">
            {layoutOptions.map(({ mode, icon: Icon, label, tooltip }) => (
              <button
                key={mode}
                onClick={() => onLayoutChange(mode)}
                className={`flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded transition-all ${
                  layoutMode === mode
                    ? 'bg-white text-blue-600 shadow-sm border border-slate-300'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title={tooltip}
                aria-label={tooltip}
              >
                <Icon className="w-4 h-4" />
                <span className="text-xs sm:text-sm font-medium hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>

          {/* Help Button */}
          <button
            onClick={onToggleHelpModal}
            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-all shadow-sm hover:shadow-md border border-slate-300 hover:border-slate-400"
            aria-label="Open help guide"
          >
            <HelpCircle className="w-4 sm:w-5 h-4 sm:h-5" />
            <span className="font-semibold hidden sm:inline">Help</span>
          </button>
          
          {/* Learn Physics Button */}
          <button
            onClick={onToggleLearningPanel}
            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg transform hover:scale-[1.02]"
            aria-label="Open physics learning panel"
          >
            <BookOpen className="w-4 sm:w-5 h-4 sm:h-5" />
            <span className="font-semibold hidden sm:inline">Learn</span>
          </button>
        </div>
        </div>
      </div>
    </header>
  );
}
