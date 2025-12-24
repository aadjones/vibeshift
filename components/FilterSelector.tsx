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
    base: 'border-corporate-border hover:border-corporate-border-hover hover:bg-corporate-bg',
    selected: 'border-corporate-border-selected bg-corporate-bg ring-2 ring-corporate-border-selected ring-offset-1',
    icon: '🏢'
  },
  sales: {
    base: 'border-sales-border hover:border-sales-border-hover hover:bg-sales-bg',
    selected: 'border-sales-border-selected bg-sales-bg ring-2 ring-sales-border-selected ring-offset-1',
    icon: '📈'
  },
  hotdog: {
    base: 'border-hotdog-border hover:border-hotdog-border-hover hover:bg-hotdog-bg',
    selected: 'border-hotdog-border-selected bg-hotdog-bg ring-2 ring-hotdog-border-selected ring-offset-1',
    icon: '🌭'
  }
};

export function FilterSelector({ selected, onChange, disabled }: FilterSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-stone-700">
        Choose your lens
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
