const fs = require('fs');
const path = require('path');

const config = fs.readFileSync(path.join(__dirname, '..', 'astro.config.mjs'), 'utf8');

// The pages break prose across lines around <strong> and <em>; Astro 7's 'jsx' default glues the words together.
test('HTML compression keeps the space between text and an inline tag', () => {
  expect(config).toMatch(/compressHTML: true,/);
});

// The dev-servers registry starts this site on 8438; a silent fallback to another port breaks it.
test('dev server is pinned to 127.0.0.1:8438 with a strict port', () => {
  expect(config).toMatch(/server: \{ host: '127\.0\.0\.1', port: 8438 \}/);
  expect(config).toMatch(/strictPort: true/);
});
