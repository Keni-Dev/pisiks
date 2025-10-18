import type { LucideIcon } from 'lucide-react';

interface DataRowProps {
  icon: LucideIcon;
  label: string;
  value: number;
  unit: string;
  secondaryValue?: number;
  secondaryUnit?: string;
}

export default function DataRow({ 
  icon: Icon, 
  label, 
  value, 
  unit, 
  secondaryValue, 
  secondaryUnit 
}: DataRowProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-200 last:border-b-0">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-orange-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-600">{label}</p>
          {secondaryValue !== undefined && secondaryUnit && (
            <p className="text-xs text-slate-400 mt-0.5">
              {secondaryValue.toFixed(2)} {secondaryUnit}
            </p>
          )}
        </div>
      </div>
      <div className="text-right">
        <p className="text-2xl font-bold text-slate-800 tabular-nums">
          {value.toFixed(2)}
        </p>
        <p className="text-sm text-slate-500 mt-0.5">{unit}</p>
      </div>
    </div>
  );
}
