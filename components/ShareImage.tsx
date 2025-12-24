'use client';

import { useRef, useState } from 'react';
import { type FilterType, filterLabels } from '@/lib/prompts';

interface ShareImageProps {
  original: string;
  transformed: string;
  filter: FilterType;
}

// Colors match CSS variables in globals.css
const filterBgColors: Record<FilterType, string> = {
  corporate: '#f8fafc', // --color-corporate-bg
  sales: '#ecfdf5',     // --color-sales-bg (was #fffbeb - FIXED)
  hotdog: '#fefce8'     // --color-hotdog-bg
};

const filterTextColors: Record<FilterType, string> = {
  corporate: '#475569', // --color-corporate-text
  sales: '#065f46',     // --color-sales-text (was #92400e - FIXED)
  hotdog: '#854d0e'     // --color-hotdog-text
};

const filterAccentColors: Record<FilterType, string> = {
  corporate: '#94a3b8', // --color-corporate-accent
  sales: '#10b981',     // --color-sales-accent (was #f59e0b - FIXED)
  hotdog: '#E8B923'     // --color-hotdog-accent
};

export function ShareImage({ original, transformed, filter }: ShareImageProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateImage = async () => {
    if (!canvasRef.current) return;

    setIsGenerating(true);

    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Canvas dimensions (Instagram-friendly 1:1 or 4:5)
      const width = 1200;
      const height = 1500;
      canvas.width = width;
      canvas.height = height;

      // Background
      ctx.fillStyle = '#fafaf9'; // stone-50
      ctx.fillRect(0, 0, width, height);

      // Header
      ctx.fillStyle = '#1c1917'; // stone-900
      ctx.font = 'bold 36px system-ui, -apple-system, sans-serif';
      ctx.fillText(`VibeShift · ${filterLabels[filter]} Lens`, 60, 80);

      // Accent line
      ctx.fillStyle = filterAccentColors[filter];
      ctx.fillRect(60, 100, width - 120, 4);

      // Split panels
      const panelY = 140;
      const panelHeight = (height - 140 - 120) / 1; // Single row for now
      const panelWidth = (width - 180) / 2;
      const gap = 60;

      // Original panel
      ctx.fillStyle = '#ffffff';
      roundRect(ctx, 60, panelY, panelWidth, panelHeight - 40, 16);
      ctx.fill();

      ctx.fillStyle = '#78716c'; // stone-500
      ctx.font = 'bold 14px system-ui, -apple-system, sans-serif';
      ctx.fillText('ORIGINAL', 80, panelY + 40);

      ctx.fillStyle = '#1c1917';
      ctx.font = '18px system-ui, -apple-system, sans-serif';
      wrapText(ctx, original, 80, panelY + 80, panelWidth - 40, 28, panelHeight - 120);

      // Transformed panel
      ctx.fillStyle = filterBgColors[filter];
      roundRect(ctx, 60 + panelWidth + gap, panelY, panelWidth, panelHeight - 40, 16);
      ctx.fill();

      ctx.fillStyle = '#78716c';
      ctx.font = 'bold 14px system-ui, -apple-system, sans-serif';
      const labelText = filterLabels[filter].toUpperCase() + (filter === 'hotdog' ? ' 🌭' : '');
      ctx.fillText(labelText, 80 + panelWidth + gap, panelY + 40);

      ctx.fillStyle = filterTextColors[filter];
      ctx.font = '18px system-ui, -apple-system, sans-serif';
      wrapText(ctx, transformed, 80 + panelWidth + gap, panelY + 80, panelWidth - 40, 28, panelHeight - 120);

      // Footer
      ctx.fillStyle = '#a8a29e'; // stone-400
      ctx.font = '20px system-ui, -apple-system, sans-serif';
      ctx.fillText('vibeshift.app', 60, height - 40);

      // Download
      const link = document.createElement('a');
      link.download = `vibeshift-${filter}-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <button
        onClick={generateImage}
        disabled={isGenerating || !transformed}
        className={`
          flex items-center justify-center gap-2 px-4 py-3 sm:py-2
          text-sm font-medium rounded-lg
          border border-stone-300
          bg-white hover:bg-stone-50
          text-stone-700
          transition-colors
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
      >
        {isGenerating ? (
          <>
            <span className="animate-spin">⏳</span>
            Generating...
          </>
        ) : (
          <>
            <span>📸</span>
            Share as Image
          </>
        )}
      </button>
      <canvas ref={canvasRef} className="hidden" />
    </>
  );
}

// Helper: Draw rounded rectangle
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

// Helper: Wrap text within bounds
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxHeight: number
) {
  const paragraphs = text.split('\n');
  let currentY = y;

  for (const paragraph of paragraphs) {
    if (currentY - y > maxHeight - lineHeight) {
      ctx.fillText('...', x, currentY);
      break;
    }

    const words = paragraph.split(' ');
    let line = '';

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);

      if (metrics.width > maxWidth && n > 0) {
        if (currentY - y > maxHeight - lineHeight) {
          ctx.fillText(line.trim() + '...', x, currentY);
          return;
        }
        ctx.fillText(line.trim(), x, currentY);
        line = words[n] + ' ';
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }

    if (currentY - y <= maxHeight - lineHeight) {
      ctx.fillText(line.trim(), x, currentY);
      currentY += lineHeight * 1.5; // Extra space between paragraphs
    }
  }
}
