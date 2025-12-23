"use client";

import { useState } from "react";
import { TextInput } from "@/components/TextInput";
import { FilterSelector } from "@/components/FilterSelector";
import { OutputDisplay } from "@/components/OutputDisplay";
import { ShareImage } from "@/components/ShareImage";
import { type FilterType } from "@/lib/prompts";

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [transformedText, setTransformedText] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("corporate");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit =
    inputText.trim().length > 0 && inputText.length <= 8000 && !isLoading;

  const handleFilterChange = (filter: FilterType) => {
    setSelectedFilter(filter);
    setTransformedText(""); // Clear old transformation when switching lenses
  };

  const handleTransform = async () => {
    if (!canSubmit) return;

    setIsLoading(true);
    setError(null);
    setTransformedText("");

    try {
      const response = await fetch("/api/transform", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: inputText,
          filter: selectedFilter,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setTransformedText(data.transformed);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <header className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-stone-900 tracking-tight">
            VibeShift
          </h1>
          <p className="text-stone-600">See writing through a different lens</p>
        </header>

        {/* Input section */}
        <section className="space-y-6">
          <TextInput
            value={inputText}
            onChange={setInputText}
            disabled={isLoading}
          />

          <FilterSelector
            selected={selectedFilter}
            onChange={handleFilterChange}
            disabled={isLoading}
          />

          {/* Action button */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleTransform}
              disabled={!canSubmit}
              className={`
                flex-1 sm:flex-none
                px-6 py-3
                text-base font-medium rounded-lg
                transition-all duration-150
                ${
                  canSubmit
                    ? "bg-stone-900 text-white hover:bg-stone-800 active:scale-[0.98]"
                    : "bg-stone-300 text-stone-500 cursor-not-allowed"
                }
              `}
            >
              {isLoading ? "Focusing..." : "View through lens"}
            </button>

            {transformedText && (
              <ShareImage
                original={inputText}
                transformed={transformedText}
                filter={selectedFilter}
              />
            )}
          </div>

          {/* Error display */}
          {error && (
            <div className="p-4 rounded-lg bg-red-50 border border-red-200">
              <p className="text-sm text-red-700">{error}</p>
              <button
                onClick={handleTransform}
                className="mt-2 text-sm font-medium text-red-700 hover:text-red-800 underline"
              >
                Try again
              </button>
            </div>
          )}
        </section>

        {/* Output section */}
        <section>
          <OutputDisplay
            original={inputText}
            transformed={transformedText}
            filter={selectedFilter}
            isLoading={isLoading}
          />
        </section>

        {/* Footer */}
        <footer className="pt-8 text-center text-sm text-stone-500">
          A language lens, not a writing tool
        </footer>
      </div>
    </main>
  );
}
