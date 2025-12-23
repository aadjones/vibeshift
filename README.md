# Vibeshift

AI-powered writing filters that transform your text into three distinct voices.

## What it does

Vibeshift takes any text and transforms it through one of three AI filters:

- **Corporate**: Strategically hollow abstraction - transforms text into committee-written corporate speak
- **Sales**: Slick, schemey desire engineering - turns everything into high-pressure sales copy
- **Hot Dog**: Deadly serious hot dog scholarship - reframes reality through the lens of hot dog philosophy

## Tech Stack

- Next.js 15
- TypeScript
- Tailwind CSS
- Anthropic Claude API

## Getting Started

1. Clone the repository:
```bash
git clone git@github.com:aadjones/vibeshift.git
cd vibeshift
```

2. Install dependencies:
```bash
npm install
```

3. Set up your environment variables:
```bash
# Create a .env.local file with your Anthropic API key
ANTHROPIC_API_KEY=your_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## How it works

Each filter uses carefully crafted prompts to guide Claude in transforming your text according to specific behavioral rules. The filters maintain consistency while producing dramatically different outputs.

## License

MIT License - see LICENSE file for details.
