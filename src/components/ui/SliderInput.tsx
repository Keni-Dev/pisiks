import Tooltip from './Tooltip';

interface SliderInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  unit?: string;
  tooltip?: string;
  ariaLabel?: string;
}

export default function SliderInput({
  label,
  value,
  onChange,
  min,
  max,
  step,
  unit = '',
  tooltip,
  ariaLabel
}: SliderInputProps) {
  // Check if value is out of bounds
  const isOutOfBounds = value < min || value > max;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseFloat(e.target.value));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    if (!isNaN(newValue)) {
      onChange(newValue);
    }
  };

  return (
    <div className="space-y-1 min-w-0">
      {/* Label */}
      <label className="flex items-center gap-1.5 text-xs font-medium text-slate-700">
        {label}
        {tooltip && <Tooltip content={tooltip} />}
      </label>

      {/* Slider and Number Input Container */}
      <div className="flex items-center gap-2 min-w-0">
        {/* Slider */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleSliderChange}
          aria-label={ariaLabel || label}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-valuetext={`${value} ${unit}`}
          className="flex-1 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer
                     accent-orange-500
                     hover:bg-slate-300 transition-colors
                     focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1"
        />

        {/* Number Input with Unit */}
  <div className="flex items-center gap-1">
          <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={handleNumberChange}
            aria-label={ariaLabel ? `${ariaLabel} (number input)` : `${label} (number input)`}
            className={`
              w-16 px-2 py-1 text-xs text-slate-900 border rounded-md
              transition-all duration-200
              focus:outline-none focus:ring-1 focus:ring-offset-1
              ${isOutOfBounds
                ? 'border-red-500 focus:ring-red-500 bg-red-50'
                : 'border-slate-300 focus:ring-orange-500 focus:border-transparent hover:border-slate-400'
              }
            `}
          />
          {unit && (
            <span className="text-xs text-slate-600 font-medium min-w-[2rem]">
              {unit}
            </span>
          )}
        </div>
      </div>
      
      {/* Validation Error Message */}
      {isOutOfBounds && (
        <p className="text-xs text-red-600 mt-0.5" role="alert">
          Value must be between {min} and {max}
        </p>
      )}
    </div>
  );
}
