import { BookOpen, HelpCircle } from 'lucide-react';

interface HeaderProps {
  onToggleLearningPanel: () => void;
  onToggleHelpModal: () => void;
}

export default function Header({ onToggleLearningPanel, onToggleHelpModal }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">
          🧭 PISIKS SIMULATION FOR MA'AM ROSE
        </h1>
        <div className="flex items-center gap-3">
          {/* Help Button */}
          <button
            onClick={onToggleHelpModal}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-all shadow-sm hover:shadow-md border border-slate-300 hover:border-slate-400"
            aria-label="Open help guide"
          >
            <HelpCircle className="w-5 h-5" />
            <span className="font-semibold">Help</span>
          </button>
          
          {/* Learn Physics Button */}
          <button
            onClick={onToggleLearningPanel}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg transform hover:scale-[1.02]"
            aria-label="Open physics learning panel"
          >
            <BookOpen className="w-5 h-5" />
            <span className="font-semibold">Learn Physics</span>
          </button>
        </div>
      </div>
    </header>
  );
}
