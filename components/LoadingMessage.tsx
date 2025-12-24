'use client';

import { useState, useEffect } from 'react';
import { type FilterType } from '@/lib/prompts';

interface LoadingMessageProps {
  filter: FilterType;
}

const loadingMessages: Record<FilterType, string[]> = {
  corporate: [
    "Synergizing strategic frameworks...",
    "Leveraging core competencies...",
    "Optimizing value propositions...",
    "Aligning stakeholder expectations...",
    "Driving innovative solutions..."
  ],
  sales: [
    "Closing the deal...",
    "Creating urgency...",
    "Building rapport...",
    "Overcoming objections...",
    "Sealing the commitment..."
  ],
  hotdog: [
    "Grilling the meat...",
    "Choosing the condiments...",
    "Toasting the bun...",
    "Adding the toppings...",
    "Plating the masterpiece..."
  ]
};

export function LoadingMessage({ filter }: LoadingMessageProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  const messages = loadingMessages[filter];

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 1200);

    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="flex items-center gap-2 not-prose">
      <div className="flex gap-1 text-stone-600">
        <span className="animate-bounce" style={{ animationDelay: '0ms' }}>●</span>
        <span className="animate-bounce" style={{ animationDelay: '150ms' }}>●</span>
        <span className="animate-bounce" style={{ animationDelay: '300ms' }}>●</span>
      </div>
      <span className="text-stone-600 italic text-sm">
        {messages[messageIndex]}
      </span>
    </div>
  );
}
