# Umai Tech - AI Consulting Website

## Project Overview

Umai Tech is a modern AI consulting website built with Astro, combining Japanese craftsmanship aesthetics ("うまい" - skillful/delicious) with cutting-edge AI technology. The website serves as a platform for AI consulting services, blog content, and showcasing AI-related projects.

**Live Site**: https://umai-tech.com

## Tech Stack

- **Framework**: Astro 5.12.3 (Static Site Generation)
- **Styling**: Tailwind CSS 3.4.17
- **Content**: MDX for blog posts with syntax highlighting (Shiki)
- **Language**: TypeScript 5.8.3
- **Package Manager**: pnpm 10.13.1
- **Deployment**: Vercel with Analytics and Speed Insights
- **Additional**: Mermaid diagrams support

## Key Features

1. **Static Site Architecture** - Fast performance with pre-built pages
2. **Full-Featured Blog** - MDX support, tags, search functionality, view tracking
3. **Japanese Cultural Integration** - Brand philosophy reflected in design
4. **Interactive Components**:
   - Collapsible Table of Contents with reading progress
   - Interactive CV component with print functionality
   - Advanced tagging and filtering system
5. **Dark Mode Support** - Consistent across all components
6. **Analytics** - Vercel Analytics for performance tracking

## Project Structure

```
umai-tech/
├── src/
│   ├── components/        # Reusable Astro components
│   │   ├── AuthorCard.astro
│   │   ├── Callout.astro
│   │   ├── Features.astro
│   │   ├── Footer.astro
│   │   ├── Header.astro
│   │   ├── Hero.astro
│   │   ├── InteractiveCV.astro
│   │   ├── Mermaid.astro
│   │   ├── PageViews.astro
│   │   ├── ProductCard.astro
│   │   ├── ProjectCard.astro
│   │   ├── ReadingTime.astro
│   │   ├── RecentPosts.astro
│   │   ├── ServiceCard.astro
│   │   ├── TableOfContents.astro
│   │   └── TeamSection.astro
│   ├── content/          # Content collections
│   │   ├── blog/        # MDX blog posts
│   │   └── config.ts    # Content schema definitions
│   ├── layouts/         # Page layout templates
│   │   └── Layout.astro
│   ├── pages/           # Route-based pages
│   │   ├── index.astro
│   │   ├── about.astro
│   │   ├── blog.astro
│   │   ├── blog/[...slug].astro
│   │   ├── contact.astro
│   │   ├── products.astro
│   │   ├── projects.astro
│   │   └── services.astro
│   └── styles/          # Global CSS
│       └── global.css
├── public/
│   ├── assets/          # Static assets (PDFs, etc.)
│   └── images/          # Image assets
│       ├── authors/
│       └── blog/
├── scripts/             # Utility scripts
│   ├── new-blog-post.js # Interactive blog post creator
│   └── new-post.sh      # Quick blog post creator
├── docs/                # Detailed documentation
│   ├── components.md
│   ├── content.md
│   └── development.md
└── Configuration files
    ├── astro.config.mjs
    ├── tailwind.config.mjs
    ├── tsconfig.json
    └── vercel.json
```

## Development Commands

**IMPORTANT**: Always ensure you're using the correct Node.js version before running any commands:

```bash
# Load nvm and switch to project Node version (required before any other commands)
export NVM_DIR="$HOME/.nvm"
[ -s "$HOMEBREW_PREFIX/opt/nvm/nvm.sh" ] && \. "$HOMEBREW_PREFIX/opt/nvm/nvm.sh"
[ -s "$HOMEBREW_PREFIX/opt/nvm/etc/bash_completion.d/nvm" ] && \. "$HOMEBREW_PREFIX/opt/nvm/etc/bash_completion.d/nvm"
nvm use

# Install dependencies
pnpm install

# Start development server (http://localhost:4321)
pnpm dev

# Build for production (includes type checking)
pnpm build

# Preview production build
pnpm preview

# Run TypeScript type checking
pnpm astro check

# Create new blog post (interactive)
pnpm new-post

# Create new blog post (quick mode)
pnpm new-post:quick "Title" "Description" "tag1,tag2"
```

### Node.js Version Management

This project requires Node.js 20.11.0 (specified in `.nvmrc`). Always run the nvm commands above before executing any project commands to ensure compatibility.

## Content Management

### Blog Post Schema

Blog posts use MDX format with the following frontmatter:

```typescript
{
  title: string
  description: string
  pubDate: Date
  updatedDate?: Date
  heroImage?: string
  tags?: string[]
  author: string (default: 'Marcus Elwin')
}
```

### Creating Blog Posts

The project includes two convenient methods for creating blog posts:

1. **Interactive Mode**: `pnpm new-post`
   - Prompts for title, description, tags
   - Shows popular tag suggestions
   - Option to add initial content

2. **Quick Mode**: `pnpm new-post:quick "Title" "Description" "tags"`
   - Creates post with provided arguments
   - Automatically generates slug from title

Both methods:
- Generate URL-friendly slugs
- Create MDX file in `src/content/blog/`
- Create image directory in `public/images/blog/{slug}/`
- Add proper frontmatter with timestamps
- Include Callout component import

## Design System

- **Primary Colors**: 
  - Umai Purple: `#8B5CF6`
  - Dark: `#0a0a0a`
  - Light: `#f5f5f5`
- **Typography**:
  - Primary: Inter
  - Code: JetBrains Mono
  - Japanese: Noto Sans JP
- **Components**: Consistent SVG icons, unified card patterns, responsive design

## Deployment

The site automatically deploys to Vercel:
- **Production**: Pushes to `main` branch
- **Preview**: Pull requests get preview deployments
- **Analytics**: Vercel Analytics enabled

## Code Quality

- Full TypeScript support with zero type errors
- Astro check runs on build to ensure type safety
- MDX syntax highlighting with Shiki (GitHub Dark theme)
- Support for multiple programming languages in code blocks

## Important Notes

1. **Static Generation**: All pages are pre-built at build time for optimal performance
2. **MDX Components**: Can use Astro components within blog posts
3. **Image Optimization**: Vercel image service enabled for automatic optimization
4. **View Tracking**: PageViews component tracks blog post views
5. **Mermaid Diagrams**: Full support for flowcharts and diagrams in blog posts

## Common Tasks

### Adding a New Page
1. Create new `.astro` file in `src/pages/`
2. Import and use the Layout component
3. Page route automatically created based on filename

### Adding a Component
1. Create new `.astro` file in `src/components/`
2. Import and use in pages or other components

### Modifying Blog Schema
1. Update schema in `src/content/config.ts`
2. Update existing blog posts to match new schema
3. Run `pnpm astro check` to verify types

### Updating Styles
- Global styles: `src/styles/global.css`
- Component styles: Use Tailwind classes or `<style>` tags in components
- Theme colors defined in `tailwind.config.mjs`

## Performance Considerations

1. **Static Generation**: Pre-built pages serve instantly
2. **Image Optimization**: Vercel automatically optimizes images
3. **Code Splitting**: Astro automatically splits JavaScript
4. **Minimal JavaScript**: Only ships JavaScript when needed
5. **Analytics**: Vercel Speed Insights track Core Web Vitals

## License

ISC License - see LICENSE file for details