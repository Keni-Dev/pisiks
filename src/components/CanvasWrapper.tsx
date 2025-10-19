import type { ReactNode } from 'react';

interface CanvasWrapperProps {
  children: ReactNode;
  className?: string;
}

export default function CanvasWrapper({ children, className = '' }: CanvasWrapperProps) {
  return (
    <div className={`bg-white rounded-lg shadow-md border border-slate-200 p-4 sm:p-6 ${className}`}>
      <div className="canvas-wrapper">
        {children}
      </div>
    </div>
  );
}
