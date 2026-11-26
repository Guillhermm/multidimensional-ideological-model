const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const layout = fs.readFileSync(path.join(root, 'src/layouts/Layout.astro'), 'utf8');
const pagesDir = path.join(root, 'src/pages');

describe('Vercel Web Analytics', () => {
  test('the layout renders the Astro component once, inside <body>', () => {
    expect(layout).toContain("import Analytics from '@vercel/analytics/astro';");
    expect(layout.match(/<Analytics \/>/g)).toHaveLength(1);
    expect(layout.indexOf('<Analytics />')).toBeGreaterThan(layout.indexOf('<body'));
    expect(layout.indexOf('<Analytics />')).toBeLessThan(layout.indexOf('</body>'));
  });

  // Tracking lives in the layout, so a page that skips it goes uncounted.
  test('every page is wrapped in the layout', () => {
    const pages = fs.readdirSync(pagesDir).filter((f) => f.endsWith('.astro'));
    expect(pages.length).toBeGreaterThan(0);
    for (const page of pages) {
      expect(fs.readFileSync(path.join(pagesDir, page), 'utf8')).toMatch(/<Layout[\s>]/);
    }
  });
});
