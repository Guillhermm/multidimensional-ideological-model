/**
 * Rasterize public/og-image.svg into public/og-image.png.
 *
 * Run with `npm run og`. The PNG is committed, so this only needs rerunning
 * when the SVG changes. The SVG stays the source; the PNG exists because
 * LinkedIn and most other link-preview crawlers do not render SVG.
 */
import sharp from 'sharp';

const info = await sharp('public/og-image.svg').png({ compressionLevel: 9 }).toFile('public/og-image.png');
console.log(`wrote public/og-image.png (${info.width}x${info.height})`);
