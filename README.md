<div align="center">
  <img src="umai-tech-logo.png" alt="Umai Tech Logo" width="200" />
</div>

# Umai Tech - AI Consulting Website

> Modern Astro-based website combining Japanese craftsmanship aesthetics with cutting-edge AI technology.

<div align="center">

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/MarcusElwin/umai-tech)

</div>

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## 📁 Project Structure

```
umai-tech/
├── src/
│   ├── components/        # Reusable UI components
│   ├── content/          # Blog content (MDX)
│   ├── layouts/          # Page layout templates
│   ├── pages/            # Route pages
│   └── styles/           # Global CSS
├── public/
│   └── images/           # Static assets
└── .github/
    └── workflows/        # CI/CD pipelines
```

## 🧩 Components

### Core Components

#### `AuthorCard.astro`
Displays author information with social links and bio.

```astro
<AuthorCard 
  author="Marcus Elwin"
  date={new Date()}
  readTime="5 min read"
  showBio={true}
/>
```

**Props:**
- `author: string` - Author name
- `date?: Date` - Publication date
- `readTime?: string` - Reading time estimate
- `showBio?: boolean` - Show author bio (default: false)

#### `Callout.astro`
Creates styled notification/alert boxes for content emphasis.

```astro
<Callout type="warning" title="Important Notice">
  This is a warning message.
</Callout>
```

**Props:**
- `type?: 'info' | 'warning' | 'error' | 'success' | 'note'` - Callout style (default: 'info')
- `title?: string` - Optional callout title

#### `RecentPosts.astro`
Displays a sidebar widget of recent blog posts.

```astro
<RecentPosts 
  limit={5}
  showDescription={true}
  title="Popular Posts"
  currentSlug="current-post-slug"
/>
```

**Props:**
- `limit?: number` - Number of posts to show (default: 3)
- `showDescription?: boolean` - Show post descriptions (default: false)
- `title?: string` - Widget title (default: "Recent Posts")
- `currentSlug?: string` - Exclude current post from list

#### `PageViews.astro`
Displays and tracks page view counts for blog posts.

```astro
<PageViews slug="my-blog-post" />
```

**Props:**
- `slug: string` - Post slug for tracking
- `className?: string` - Additional CSS classes

#### `Mermaid.astro`
Renders Mermaid diagrams within blog content.

```astro
<Mermaid code={`
  graph TD;
    A[Start] --> B[Process]
    B --> C[End]
`} />
```

**Props:**
- `code: string` - Mermaid diagram code

### Layout Components

#### `Header.astro`
Fixed navigation header with animated logo and responsive menu.

#### `Footer.astro`
Site-wide footer with navigation links and brand information.

#### `Hero.astro`
Main landing page hero section with Japanese-inspired design.

#### `Features.astro`
Displays company expertise/services in a responsive grid layout.

### Layout Template

#### `Layout.astro`
Base layout template for all pages.

```astro
<Layout title="Page Title" description="Page description">
  <!-- Your content here -->
</Layout>
```

**Props:**
- `title: string` - Page title
- `description?: string` - Page description (default: company description)
- `noHeader?: boolean` - Exclude header (default: false)
- `noFooter?: boolean` - Exclude footer (default: false)

## 📝 Content Management

### Blog Posts

Blog posts are written in MDX format and stored in `src/content/blog/`. Each post requires frontmatter:

```mdx
---
title: "Your Blog Post Title"
description: "Brief description of the post"
pubDate: 2024-01-15
tags: ["ai", "technology", "consulting"]
author: "Marcus Elwin"
---

Your blog content here with support for:
- **Markdown** formatting
- Astro components like <Callout type="info">callouts</Callout>
- <Mermaid code="graph TD; A-->B" />
```

**Required Fields:**
- `title: string`
- `description: string`
- `pubDate: Date`

**Optional Fields:**
- `updatedDate: Date`
- `heroImage: string`
- `tags: string[]`
- `author: string` (default: "Marcus Elwin")

### Adding Images

Place blog images in `public/images/blog/[post-slug]/` and reference them in your MDX:

```mdx
![Alt text](/images/blog/my-post/image.png)
```

## 🎨 Styling

### Custom Color Palette

```css
/* Primary Colors */
--umai-primary: #0a0a0a
--umai-secondary: #f5f5f5
--umai-accent: #8B5CF6

/* Grayscale */
--umai-gray-50: #fafafa
--umai-gray-900: #111111
```

### Typography

- **Primary**: Inter (sans-serif)
- **Monospace**: JetBrains Mono
- **Japanese**: Noto Sans JP

### Dark Mode

Dark mode is implemented using Tailwind's class-based approach. Toggle with the `dark` class on the HTML element.

## 🚀 Deployment

### GitHub Actions

The project includes two workflows:

#### CI Pipeline (`.github/workflows/ci.yml`)
- Runs on push to `main`/`develop` and PRs to `main`
- TypeScript checking with `astro check`
- Production build testing
- Artifact upload

#### Deployment Pipeline (`.github/workflows/deploy.yml`)
- Deploys to Vercel on push to `main`
- Requires environment secrets:
  - `VERCEL_TOKEN`
  - `VERCEL_ORG_ID`
  - `VERCEL_PROJECT_ID`

### Manual Deployment

```bash
# Build for production
pnpm build

# Deploy to your preferred platform
# The built files will be in the `dist/` directory
```

## 🛠️ Development

### Prerequisites

- Node.js 20+
- pnpm 10.13.1+

### Available Scripts

```bash
pnpm dev         # Start development server
pnpm build       # Build for production (includes type checking)
pnpm preview     # Preview production build
pnpm astro       # Run Astro CLI commands
```

### Key Features

- ✨ **Static Site Generation** with Astro
- 🎌 **Japanese Cultural Integration** - Brand philosophy and design
- 📝 **Full-Featured Blog** - MDX, tags, search, view tracking
- 🌙 **Dark Mode Support** - Consistent throughout all components
- 📱 **Responsive Design** - Mobile-first approach
- ⚡ **Performance Optimized** - Minimal JavaScript, optimized assets
- 🔍 **SEO Ready** - Semantic HTML, meta tags, structured content
- 🎨 **Modern Styling** - Tailwind CSS with custom design system

### Architecture Decisions

- **Astro**: Chosen for optimal performance and SEO with minimal JavaScript
- **MDX**: Enables rich content with embedded components
- **Tailwind**: Provides consistent design system with dark mode support
- **Content Collections**: Type-safe content management with automatic routing
- **Component-Based**: Reusable components for maintainability

## 📄 License

ISC License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests with `pnpm build`
5. Submit a pull request

---

**Umai Tech** (うまい) - Where Japanese craftsmanship meets AI innovation.
