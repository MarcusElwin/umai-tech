import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import mermaid from 'astro-mermaid';
import vercel from '@astrojs/vercel';
import icon from 'astro-icon';

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
    mermaid(),
    icon()
  ],
  markdown: {
    // remark-gfm labels the footnote list "Footnotes" and hides the heading
    // from sighted readers. The heading is made visible in global.css; this
    // gives it the name these actually are.
    remarkRehype: {
      footnoteLabel: 'References',
      footnoteBackLabel: (index) => `Back to reference ${index + 1}`,
    },
  },
  output: 'static',
  redirects: {
    '/resume': '/cv',
  },
  adapter: vercel({
    webAnalytics: { enabled: true },
    imageService: true,
  }),
  site: 'https://umai-tech.com',
});