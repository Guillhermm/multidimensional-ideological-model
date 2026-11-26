import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'static',
  // Astro 7 defaults to 'jsx', which drops the line break between text and an inline tag ("across<strong>").
  compressHTML: true,
  site: 'https://mim.zenus.systems',
  server: { host: '127.0.0.1', port: 8438 },
  vite: {
    plugins: [tailwindcss()],
    server: { strictPort: true }
  }
});
