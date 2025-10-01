# Portuguese Drills Expanded

An expanded version of Portuguese learning drills with additional content, features, and practice materials. Filter by topic, search by keyword, and launch a drill to practice.

Designed to be dialect-neutral (PT-PT and PT-BR) with enhanced learning experiences.

- Base project: https://kleinster2.github.io/portuguese-drills/
- Tech: plain HTML + Tailwind CDN + a small script (no build step)

## Features
- Filterable, searchable card grid of drills
- Accessible: active filter state (`aria-pressed`) and live results count
- Smooth hide/show transitions for cards
- Remembers your last filter and search via `localStorage`

## Usage
- Open `index.html` locally in any modern browser, or visit the live site.
- Click a filter or type in the search box to narrow drills.

## Development
- No toolchain required. Edit `index.html` and refresh the browser.
- Deployments are handled by GitHub Pages on branch `main`.

## Contributing
- Open an issue with suggestions or a pull request with focused changes.
- For larger changes, consider discussing first in an issue.



## Dialects
Drills default to Brazilian Portuguese. You can ask any tutor to respond in European Portuguese.


## Backend (Cloudflare Pages Functions)
This site includes an optional grading endpoint at \/api/grade\ implemented as a Cloudflare Pages Function.\r\n- Add an environment variable \OPENAI_API_KEY\ in Pages → Settings → Environment variables.\r\n- Functions live under \unctions/api/\. The endpoint accepts JSON: {drillId, prompt, answer, dialect:'BR'|'PT'}.\r\n- Local dev: \wrangler pages dev\ (installs Wrangler) or use Pages preview.\r\n- CORS allows your GitHub Pages origin and localhost:8788. Adjust in \unctions/api/grade.ts\.\r\n
