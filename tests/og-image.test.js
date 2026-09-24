const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const layout = fs.readFileSync(path.join(root, 'src/layouts/Layout.astro'), 'utf8');

// Width and height live in the IHDR chunk, right after the 8-byte signature
// and the chunk's own length and type fields.
function pngSize(file) {
  const buf = fs.readFileSync(file);
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  if (!buf.subarray(0, 8).equals(signature)) throw new Error(`${file} is not a PNG`);
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

describe('link preview image', () => {
  // LinkedIn and most preview crawlers ignore SVG, so the card has to be raster.
  test('og:image and twitter:image point at the PNG card', () => {
    expect(layout).toMatch(/property="og:image" content=\{new URL\('\/og-image\.png'/);
    expect(layout).toMatch(/name="twitter:image" content=\{new URL\('\/og-image\.png'/);
    expect(layout).not.toMatch(/og-image\.svg/);
  });

  test('the PNG exists and matches the declared 1200x630', () => {
    const { width, height } = pngSize(path.join(root, 'public/og-image.png'));
    expect(layout).toContain(`property="og:image:width" content="${width}"`);
    expect(layout).toContain(`property="og:image:height" content="${height}"`);
    expect([width, height]).toEqual([1200, 630]);
  });
});
