'use client';

import { type FilterType, filterLabels, filterDescriptions } from '@/lib/prompts';

interface FilterSelectorProps {
  selected: FilterType;
  onChange: (filter: FilterType) => void;
  disabled?: boolean;
}

const filters: FilterType[] = ['corporate', 'sales', 'hotdog'];

const filterStyles: Record<FilterType, { base: string; selected: string; icon: string }> = {
  corporate: {
    base: 'border-stone-300 hover:border-stone-400 hover:bg-stone-50',
    selected: 'border-stone-600 bg-stone-100 ring-2 ring-stone-600 ring-offset-1',
    icon: '🏢'
  },
  sales: {
    base: 'border-amber-300 hover:border-amber-400 hover:bg-amber-50',
    selected: 'border-amber-500 bg-amber-50 ring-2 ring-amber-500 ring-offset-1',
    icon: '📈'
  },
  hotdog: {
    base: 'border-yellow-400 hover:border-yellow-500 hover:bg-yellow-50',
    selected: 'border-hotdog-mustard bg-yellow-50 ring-2 ring-hotdog-mustard ring-offset-1',
    icon: '🌭'
  }
};

export function FilterSelector({ selected, onChange, disabled }: FilterSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-stone-700">
        Choose your lens
      </label>
      <div className="grid grid-cols-3 gap-3">
        {filters.map((filter) => {
          const isSelected = selected === filter;
          const styles = filterStyles[filter];

          return (
            <button
              key={filter}
              onClick={() => onChange(filter)}
              disabled={disabled}
              className={`
                p-4 rounded-lg border-2 transition-all duration-150
                text-left
                disabled:opacity-50 disabled:cursor-not-allowed
                ${isSelected ? styles.selected : styles.base}
              `}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{styles.icon}</span>
                <span className="font-semibold text-stone-900">
                  {filterLabels[filter]}
                </span>
              </div>
              <p className="text-xs text-stone-600 leading-tight">
                {filterDescriptions[filter]}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
