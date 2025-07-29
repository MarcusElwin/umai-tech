<div align="center">
  <img src="umai-tech-logo.png" alt="Umai Tech Logo" width="200" />
</div>

# Umai Tech - AI Consulting Website

> Modern Astro-based website combining Japanese craftsmanship aesthetics with cutting-edge AI technology.

<div align="center">

[![CI](https://github.com/MarcusElwin/umai-tech/workflows/CI/badge.svg)](https://github.com/MarcusElwin/umai-tech/actions/workflows/ci.yml)
[![Deploy to Vercel](https://github.com/MarcusElwin/umai-tech/workflows/Deploy%20to%20Vercel/badge.svg)](https://github.com/MarcusElwin/umai-tech/actions/workflows/deploy.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Astro](https://img.shields.io/badge/Built_with-Astro-FF5D01?logo=astro&logoColor=white)](https://astro.build/)
[![Tailwind CSS](https://img.shields.io/badge/Styled_with-Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

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

# Type checking
pnpm astro check
```

## ✨ Key Features

- **Static Site Generation** with Astro for optimal performance
- **Japanese Cultural Integration** - Brand philosophy and design
- **Full-Featured Blog** - MDX, tags, search, view tracking
- **Collapsible Table of Contents** - Smooth animations with reading progress
- **Consistent Design System** - SVG icons, unified colors, card patterns
- **Dark Mode Support** - Consistent throughout all components
- **Interactive CV Component** - Dynamic resume with print functionality
- **Advanced Tagging System** - Searchable and filterable content
- **TypeScript Ready** - Full type safety with zero errors
- **Vercel Analytics** - Built-in performance and usage tracking

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
├── docs/                 # Detailed documentation
└── .github/
    └── workflows/        # CI/CD pipelines
```

## 📚 Documentation

For detailed documentation, see the [`docs/`](./docs/) folder:

- **[Components Guide](./docs/components.md)** - Detailed component documentation and usage
- **[Development Guide](./docs/development.md)** - Setup, deployment, and workflows
- **[Content Management](./docs/content.md)** - Blog writing and content guidelines

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
pnpm astro check # TypeScript type checking (0 errors, 0 warnings)
pnpm new-post    # Interactive blog post creation
pnpm new-post:quick # Quick blog post creation (requires args)
```

### Creating Blog Posts

#### Interactive Mode
```bash
pnpm new-post
```
This will prompt you for:
- Blog post title
- Brief description
- Tags (shows popular tag suggestions)
- Optional initial content

#### Quick Mode
```bash
pnpm new-post:quick "Blog Post Title" "Description" "tag1,tag2,tag3"
# Example:
pnpm new-post:quick "My AI Journey" "Exploring the world of AI" "AI,Machine Learning,Python"
```

Both commands will:
- Generate a URL-friendly slug from your title
- Create an MDX file in `src/content/blog/`
- Create an image directory in `public/images/blog/{slug}/`
- Add proper frontmatter with author and timestamps
- Include Callout component import
- Provide quick reference for adding images and using callouts

## 🚀 Deployment

This project automatically deploys to Vercel:

- **Production**: Pushes to `main` branch deploy to production
- **Preview**: Pull requests get preview deployments
- **Analytics**: Vercel Analytics enabled for performance tracking

## 🎨 Design System

### Color Palette

```css
/* Primary Colors */
--umai-primary: #0a0a0a
--umai-secondary: #f5f5f5
--umai-accent: #8B5CF6
--umai-accent-dark: #7C3AED
--umai-accent-light: #A78BFA

/* Grayscale */
--umai-gray-50: #fafafa
--umai-gray-100: #f4f4f5
--umai-gray-200: #e4e4e7
--umai-gray-300: #d4d4d8
--umai-gray-400: #a1a1aa
--umai-gray-500: #71717a
--umai-gray-600: #52525b
--umai-gray-700: #3f3f46
--umai-gray-800: #27272a
--umai-gray-900: #18181b
```

### Typography

- **Primary**: Inter
- **Code**: JetBrains Mono  
- **Japanese**: Noto Sans JP

### Components

- Consistent SVG icons
- Unified card patterns
- Responsive design

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests with `pnpm build`
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

---

**Umai Tech** (うまい) - Where Japanese craftsmanship meets AI innovation.