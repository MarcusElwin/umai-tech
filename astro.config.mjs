import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import mermaid from 'astro-mermaid';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind(), 
    mdx({
      syntaxHighlight: 'shiki',
      shikiConfig: {
        theme: 'github-dark',
        langs: ['javascript', 'typescript', 'python', 'json', 'bash', 'shell', 'markdown', 'html', 'css'],
        wrap: true
      }
    }), 
    mermaid()
  ],
  output: 'static',
  adapter: vercel({
    webAnalytics: { enabled: true },
    imageService: true,
  }),
  site: 'https://umai-tech.com',
});