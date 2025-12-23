'use client';

import { useState, useRef } from 'react';
import { type FilterType, filterLabels } from '@/lib/prompts';

interface OutputDisplayProps {
  original: string;
  transformed: string;
  filter: FilterType;
  isLoading: boolean;
}

type ViewMode = 'side-by-side' | 'original' | 'transformed';

const filterTextStyles: Record<FilterType, string> = {
  corporate: 'filter-corporate text-corporate-text',
  sales: 'filter-sales text-sales-text',
  hotdog: 'filter-hotdog text-hotdog-text'
};

const filterBgStyles: Record<FilterType, string> = {
  corporate: 'bg-corporate-bg',
  sales: 'bg-sales-bg',
  hotdog: 'bg-hotdog-bg'
};

export function OutputDisplay({ original, transformed, filter, isLoading }: OutputDisplayProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('side-by-side');
  const containerRef = useRef<HTMLDivElement>(null);

  const hasContent = original.trim().length > 0 || transformed.length > 0;

  if (!hasContent && !isLoading) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* View toggle - hidden on mobile where we only show toggle mode */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-stone-700">
          {transformed ? `Viewed through ${filterLabels[filter]} lens` : 'Awaiting transformation...'}
        </h2>

        <div className="hidden md:flex items-center gap-1 bg-stone-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode('side-by-side')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              viewMode === 'side-by-side'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Side by Side
          </button>
          <button
            onClick={() => setViewMode('original')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              viewMode === 'original'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Original
          </button>
          <button
            onClick={() => setViewMode('transformed')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              viewMode === 'transformed'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Transformed
          </button>
        </div>

        {/* Mobile toggle */}
        <div className="flex md:hidden items-center gap-1 bg-stone-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode(viewMode === 'original' ? 'transformed' : 'original')}
            className="px-3 py-1 text-sm rounded-md bg-white text-stone-900 shadow-sm"
          >
            {viewMode === 'original' ? 'Show Transformed' : 'Show Original'}
          </button>
        </div>
      </div>

      {/* Content area */}
      <div
        ref={containerRef}
        className={`
          rounded-lg border border-stone-200 overflow-hidden
          ${viewMode === 'side-by-side' ? 'hidden md:grid md:grid-cols-2' : ''}
        `}
      >
        {/* Original panel */}
        {(viewMode === 'side-by-side' || viewMode === 'original') && (
          <div className={`p-6 ${viewMode === 'side-by-side' ? 'border-r border-stone-200' : ''} bg-white`}>
            <div className="text-xs font-medium text-stone-500 uppercase tracking-wider mb-3">
              Original
            </div>
            <div className="prose prose-stone prose-sm max-w-none whitespace-pre-wrap">
              {original || <span className="text-stone-400 italic">No text yet</span>}
            </div>
          </div>
        )}

        {/* Transformed panel */}
        {(viewMode === 'side-by-side' || viewMode === 'transformed') && (
          <div className={`p-6 ${filterBgStyles[filter]}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-medium text-stone-500 uppercase tracking-wider">
                {filterLabels[filter]}
                {filter === 'hotdog' && <span className="ml-1">🌭</span>}
              </div>
            </div>
            <div
              className={`
                prose prose-sm max-w-none whitespace-pre-wrap
                ${filterTextStyles[filter]}
                ${isLoading ? 'lens-loading' : transformed ? 'lens-reveal' : ''}
              `}
            >
              {isLoading ? (
                <span className="text-stone-400 italic">Focusing lens...</span>
              ) : transformed ? (
                transformed
              ) : (
                <span className="text-stone-400 italic">Click "View through lens" to transform</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mobile: Show the hidden panel */}
      {viewMode !== 'side-by-side' && (
        <div className="md:hidden rounded-lg border border-stone-200 overflow-hidden">
          {viewMode === 'original' ? (
            <div className={`p-6 ${filterBgStyles[filter]}`}>
              <div className="text-xs font-medium text-stone-500 uppercase tracking-wider mb-3">
                {filterLabels[filter]}
              </div>
              <div
                className={`
                  prose prose-sm max-w-none whitespace-pre-wrap
                  ${filterTextStyles[filter]}
                  ${isLoading ? 'lens-loading' : transformed ? 'lens-reveal' : ''}
                `}
              >
                {isLoading ? (
                  <span className="text-stone-400 italic">Focusing lens...</span>
                ) : transformed || <span className="text-stone-400 italic">Not yet transformed</span>}
              </div>
            </div>
          ) : (
            <div className="p-6 bg-white">
              <div className="text-xs font-medium text-stone-500 uppercase tracking-wider mb-3">
                Original
              </div>
              <div className="prose prose-stone prose-sm max-w-none whitespace-pre-wrap">
                {original || <span className="text-stone-400 italic">No text yet</span>}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
