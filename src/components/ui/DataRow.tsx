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
    <div className="flex items-center justify-between py-2 border-b border-slate-200 last:border-b-0">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
          <Icon className="w-4 h-4 text-orange-600" />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-600">{label}</p>
          {secondaryValue !== undefined && secondaryUnit && (
            <p className="text-xs text-slate-400 mt-0.5">
              {secondaryValue.toFixed(2)} {secondaryUnit}
            </p>
          )}
        </div>
      </div>
      <div className="text-right">
        <p className="text-xl font-bold text-slate-800 tabular-nums">
          {value.toFixed(2)}
        </p>
        <p className="text-xs text-slate-500">{unit}</p>
      </div>
    </div>
  );
}
