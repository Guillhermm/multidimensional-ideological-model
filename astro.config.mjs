import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'static',
  site: 'https://multidimensional-ideological-model.vercel.app',
  vite: {
    plugins: [tailwindcss()]
  }
});
