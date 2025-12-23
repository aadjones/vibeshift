'use client';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const PLACEHOLDER_TEXT = `After 10 years in tech, here's what I've learned:

1. Relationships matter more than code
2. The best engineers are great communicators
3. Failure is just feedback in disguise
4. Always be learning

What would you add to this list? Drop your thoughts below 👇`;

const WARNING_THRESHOLD = 4000;
const MAX_LENGTH = 8000;

export function TextInput({ value, onChange, disabled }: TextInputProps) {
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
        placeholder={PLACEHOLDER_TEXT}
        disabled={disabled}
        className={`
          w-full min-h-[200px] p-4
          border rounded-lg
          bg-white
          text-stone-900 placeholder:text-stone-400
          focus:outline-none focus:ring-2 focus:ring-stone-400 focus:border-transparent
          disabled:opacity-50 disabled:cursor-not-allowed
          resize-y
          ${isOverLimit ? 'border-red-400 focus:ring-red-400' : 'border-stone-300'}
        `}
      />
      <div className="flex justify-between items-center text-sm">
        <div>
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
        <span className={`tabular-nums ${isOverLimit ? 'text-red-600' : 'text-stone-500'}`}>
          {charCount.toLocaleString()} / {MAX_LENGTH.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
