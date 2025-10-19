import { BookOpen } from 'lucide-react';

interface HeaderProps {
  onToggleLearningPanel: () => void;
}

export default function Header({ onToggleLearningPanel }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">
          🧭 PISIKS SIMULATION FOR MA'AM ROSE
        </h1>
        <button
          onClick={onToggleLearningPanel}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
        >
          <BookOpen className="w-5 h-5" />
          <span className="font-semibold">Learn Physics</span>
        </button>
      </div>
    </header>
  );
}
