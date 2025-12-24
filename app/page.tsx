"use client";

import { useState } from "react";
import Image from "next/image";
import { TextInput } from "@/components/TextInput";
import { FilterSelector } from "@/components/FilterSelector";
import { OutputDisplay } from "@/components/OutputDisplay";
import { ShareImage } from "@/components/ShareImage";
import { type FilterType } from "@/lib/prompts";

const DEFAULT_TEXT = `I woke up this morning feeling great. The sun was shining through my window. I made myself a cup of coffee and sat down to read the newspaper. My cat jumped onto my lap and started purring. It was a perfect way to start the day.`;

export default function Home() {
  const [inputText, setInputText] = useState(DEFAULT_TEXT);
  const [transformedTexts, setTransformedTexts] = useState<Record<FilterType, string>>({
    corporate: "",
    sales: "",
    hotdog: ""
  });
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("corporate");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit =
    inputText.trim().length > 0 && inputText.length <= 600 && !isLoading;

  const handleFilterChange = (filter: FilterType) => {
    setSelectedFilter(filter);
  };

  const handleTransform = async () => {
    if (!canSubmit) return;

    setIsLoading(true);
    setError(null);

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
        // Provide more specific error messages based on status code
        if (response.status === 429) {
          throw new Error("Rate limit reached. Please wait a moment and try again.");
        } else if (response.status === 400) {
          throw new Error(data.error || "Invalid input. Please check your text and try again.");
        } else if (response.status >= 500) {
          throw new Error("Server error. Please try again in a few moments.");
        } else {
          throw new Error(data.error || "Something went wrong");
        }
      }

      setTransformedTexts(prev => ({
        ...prev,
        [selectedFilter]: data.transformed
      }));
    } catch (err) {
      // Handle network errors vs API errors
      if (err instanceof TypeError && err.message.includes('fetch')) {
        setError("Network error. Please check your connection and try again.");
      } else {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <header className="text-center space-y-3">
          <div className="flex items-center justify-center gap-3">
            <Image
              src="/icon.svg"
              alt="VibeShift lens icon"
              width={32}
              height={32}
              className="opacity-80"
            />
            <h1 className="text-3xl font-bold text-stone-900 tracking-tight">
              VibeShift
            </h1>
          </div>
          <p className="text-stone-600">See writing through a different lens</p>
        </header>

        {/* Input section */}
        <section className="space-y-6">
          <TextInput
            value={inputText}
            onChange={setInputText}
            disabled={isLoading}
            placeholder={DEFAULT_TEXT}
          />

          <FilterSelector
            selected={selectedFilter}
            onChange={handleFilterChange}
            disabled={isLoading}
          />

          {/* Action button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={handleTransform}
              disabled={!canSubmit}
              className={`
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

            {transformedTexts[selectedFilter] && (
              <ShareImage
                original={inputText}
                transformed={transformedTexts[selectedFilter]}
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
            transformed={transformedTexts[selectedFilter]}
            filter={selectedFilter}
            isLoading={isLoading}
          />
        </section>
      </div>
    </main>
  );
}
