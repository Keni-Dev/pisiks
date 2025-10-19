import { useState, useRef, useEffect } from 'react';
import type { ReactNode } from 'react';
import { HelpCircle } from 'lucide-react';

interface TooltipProps {
  content: string;
  children?: ReactNode;
}

export default function Tooltip({ content, children }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<'top' | 'bottom'>('top');
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const tooltipId = useRef(`tooltip-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    if (isVisible && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      
      // Check if there's enough space above
      const spaceAbove = triggerRect.top;
      const spaceBelow = window.innerHeight - triggerRect.bottom;
      
      if (spaceAbove < tooltipRect.height + 10 && spaceBelow > spaceAbove) {
        setPosition('bottom');
      } else {
        setPosition('top');
      }
    }
  }, [isVisible]);

  return (
    <div 
      ref={triggerRef}
      className="relative inline-flex items-center"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {/* Trigger element */}
      {children || (
        <button
          type="button"
          className="inline-flex items-center justify-center w-5 h-5 text-slate-400 hover:text-slate-600 focus:text-slate-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1 rounded-full transition-colors"
          aria-describedby={isVisible ? tooltipId.current : undefined}
          aria-label="More information"
          tabIndex={0}
        >
          <HelpCircle size={16} />
        </button>
      )}

      {/* Tooltip */}
      {isVisible && (
        <div
          ref={tooltipRef}
          id={tooltipId.current}
          role="tooltip"
          className={`
            absolute z-50 px-3 py-2 text-xs font-medium text-white bg-slate-900 rounded-lg shadow-lg
            max-w-xs whitespace-normal
            ${position === 'top' 
              ? 'bottom-full left-1/2 -translate-x-1/2 mb-2' 
              : 'top-full left-1/2 -translate-x-1/2 mt-2'
            }
            animate-in fade-in-0 zoom-in-95 duration-200
          `}
        >
          {content}
          {/* Arrow */}
          <div
            className={`
              absolute left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45
              ${position === 'top' ? 'bottom-[-4px]' : 'top-[-4px]'}
            `}
          />
        </div>
      )}
    </div>
  );
}
