interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupProps {
  label: string;
  options: RadioOption[];
  selectedValue: string;
  onChange: (value: string) => void;
}

export default function RadioGroup({
  label,
  options,
  selectedValue,
  onChange
}: RadioGroupProps) {
  return (
    <div className="space-y-2">
      {/* Label */}
      <label className="block text-sm font-medium text-slate-700">
        {label}
      </label>

      {/* Radio Options */}
      <div className="flex flex-wrap gap-3">
        {options.map((option) => {
          const isSelected = selectedValue === option.value;
          
          return (
            <label
              key={option.value}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-md border cursor-pointer
                transition-all duration-200
                ${isSelected
                  ? 'bg-orange-50 border-orange-500 text-orange-900'
                  : 'bg-white border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-50'
                }
              `}
            >
              <input
                type="radio"
                name={label}
                value={option.value}
                checked={isSelected}
                onChange={(e) => onChange(e.target.value)}
                className="w-4 h-4 text-orange-500 border-slate-300 
                           focus:ring-2 focus:ring-orange-500 focus:ring-offset-2
                           cursor-pointer"
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
