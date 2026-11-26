const fs = require('fs');
const path = require('path');

const config = fs.readFileSync(path.join(__dirname, '..', 'astro.config.mjs'), 'utf8');

// The pages break prose across lines around <strong> and <em>; Astro 7's 'jsx' default glues the words together.
test('HTML compression keeps the space between text and an inline tag', () => {
  expect(config).toMatch(/compressHTML: true,/);
});
