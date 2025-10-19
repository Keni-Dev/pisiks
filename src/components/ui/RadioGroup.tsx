import Tooltip from './Tooltip';

interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupProps {
  label: string;
  options: RadioOption[];
  selectedValue: string;
  onChange: (value: string) => void;
  tooltip?: string;
  ariaLabel?: string;
}

export default function RadioGroup({
  label,
  options,
  selectedValue,
  onChange,
  tooltip,
  ariaLabel
}: RadioGroupProps) {
  const groupId = `radio-group-${label.toLowerCase().replace(/\s+/g, '-')}`;
  
  return (
    <div className="space-y-2" role="radiogroup" aria-label={ariaLabel || label}>
      {/* Label */}
      <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
        {label}
        {tooltip && <Tooltip content={tooltip} />}
      </label>

      {/* Radio Options */}
      <div className="flex flex-wrap gap-3">
        {options.map((option) => {
          const isSelected = selectedValue === option.value;
          const optionId = `${groupId}-${option.value}`;
          
          return (
            <label
              key={option.value}
              htmlFor={optionId}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-md border cursor-pointer
                transition-all duration-200
                ${isSelected
                  ? 'bg-orange-50 border-orange-500 text-orange-900 shadow-sm'
                  : 'bg-white border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-50 hover:shadow-sm'
                }
              `}
            >
              <input
                id={optionId}
                type="radio"
                name={groupId}
                value={option.value}
                checked={isSelected}
                onChange={(e) => onChange(e.target.value)}
                aria-checked={isSelected}
                className="w-4 h-4 text-orange-500 border-slate-300 
                           focus:ring-2 focus:ring-orange-500 focus:ring-offset-2
                           cursor-pointer transition-all"
              />
              <span className="text-sm font-medium select-none">
                {option.label}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
