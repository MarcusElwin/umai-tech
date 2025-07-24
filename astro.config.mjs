import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import mermaid from 'astro-mermaid';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), mdx(), mermaid()],
  output: 'static',
  site: 'https://umai-tech.com',
});