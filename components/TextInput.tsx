'use client';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

const WARNING_THRESHOLD = 400;
const MAX_LENGTH = 600;

export function TextInput({ value, onChange, disabled, placeholder }: TextInputProps) {
  const charCount = value.length;
  const isWarning = charCount > WARNING_THRESHOLD;
  const isOverLimit = charCount > MAX_LENGTH;

  return (
    <div className="space-y-2">
      <label htmlFor="input-text" className="block text-sm font-medium text-stone-700">
        Paste your text
      </label>
      <textarea
        id="input-text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          w-full min-h-[200px] sm:min-h-[240px] p-4
          border rounded-lg
          bg-white
          text-stone-900 placeholder:text-stone-400
          focus:outline-none focus:ring-2 focus:ring-stone-400 focus:border-transparent
          disabled:opacity-50 disabled:cursor-not-allowed
          resize-y
          text-base
          ${isOverLimit ? 'border-red-400 focus:ring-red-400' : 'border-stone-300'}
        `}
      />
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0 text-sm">
        <div className="order-2 sm:order-1">
          {isWarning && !isOverLimit && (
            <span className="text-amber-600">
              Getting long — shorter text works best
            </span>
          )}
          {isOverLimit && (
            <span className="text-red-600">
              Text is too long (max {MAX_LENGTH.toLocaleString()} characters)
            </span>
          )}
        </div>
        <span className={`tabular-nums order-1 sm:order-2 ${isOverLimit ? 'text-red-600' : 'text-stone-500'}`}>
          {charCount.toLocaleString()} / {MAX_LENGTH.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
