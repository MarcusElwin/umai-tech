# Development Guide

This guide covers development setup, workflows, deployment, and best practices for the Umai Tech website.

## Prerequisites

### Required Software

- **Node.js**: 20+ (specified in `.nvmrc`)
- **pnpm**: 10.13.1+ (package manager)
- **Git**: For version control

### Optional Tools

- **nvm**: For Node.js version management
- **VS Code**: Recommended editor with Astro extension

## Development Setup

### 1. Initial Setup

```bash
# Clone the repository
git clone https://github.com/MarcusElwin/umai-tech.git
cd umai-tech

# Use correct Node.js version (if using nvm)
nvm use

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### 2. Environment Configuration

The project automatically configures itself for different environments:

- **Development**: `pnpm dev` (localhost:4321)
- **Production**: Automatically deployed to Vercel

No additional environment variables are required for basic functionality.

## Available Scripts

### Core Commands

```bash
# Development
pnpm dev              # Start development server with hot reload
pnpm build            # Build for production (includes type checking)
pnpm preview          # Preview production build locally

# Quality Assurance
pnpm astro check      # TypeScript type checking (should show 0 errors)
pnpm astro --help     # View all Astro CLI commands
```

### Key Build Features

- **Type Checking**: Integrated into build process
- **Asset Optimization**: Automatic image and CSS optimization
- **Static Generation**: Pre-rendered pages for optimal performance

## Project Architecture

### Technology Stack

- **Framework**: Astro 4.x (Static Site Generator)
- **Styling**: Tailwind CSS with custom design system
- **Content**: MDX for blog posts with frontmatter
- **TypeScript**: Full type safety throughout
- **Analytics**: Vercel Analytics integration

### Architecture Decisions

| Technology | Reasoning |
|------------|-----------|
| **Astro** | Optimal performance with minimal JavaScript, excellent SEO |
| **MDX** | Rich content with embedded components |
| **Tailwind** | Consistent design system with dark mode support |
| **Content Collections** | Type-safe content management with automatic routing |
| **Component-Based** | Reusable components for maintainability |

### Directory Structure

```
src/
├── components/          # Reusable UI components
│   ├── AuthorCard.astro    # Author information display
│   ├── Callout.astro       # Alert/notification boxes
│   ├── Header.astro        # Site navigation
│   ├── TableOfContents.astro # Collapsible TOC
│   └── ...
├── content/            # Content collections
│   ├── blog/              # Blog posts (MDX)
│   └── config.ts          # Content schema definitions
├── layouts/            # Page layout templates
│   └── Layout.astro       # Base layout with SEO
├── pages/              # Route pages
│   ├── index.astro        # Landing page
│   ├── blog.astro         # Blog listing
│   ├── blog/[...slug].astro # Dynamic blog post pages
│   └── ...
├── styles/             # Global styles
│   └── global.css         # Tailwind imports and custom CSS
└── utils/              # Utility functions
```

## Development Workflow

### 1. Feature Development

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and test
pnpm dev

# Verify types and build
pnpm astro check
pnpm build

# Commit and push
git add .
git commit -m "feat: add your feature description"
git push origin feature/your-feature-name
```

### 2. Quality Checks

Before committing, ensure:

- ✅ `pnpm astro check` shows 0 errors, 0 warnings
- ✅ `pnpm build` completes successfully
- ✅ All pages render correctly in preview
- ✅ Dark mode works properly
- ✅ Mobile responsiveness is maintained

### 3. Code Standards

- **TypeScript**: Full type safety, no `any` types
- **Components**: Consistent prop interfaces and documentation
- **Styling**: Use design system colors and spacing
- **Icons**: SVG icons from the standardized icon system
- **Accessibility**: Semantic HTML and ARIA attributes

## Deployment

### Automatic Deployment

The project uses GitHub Actions for automatic deployment:

#### Production Deployment
- **Trigger**: Push to `main` branch
- **Target**: Production environment at `https://umai-tech.com`
- **Process**: Build → Deploy → Analytics enabled

#### Preview Deployment
- **Trigger**: Pull requests to `main`
- **Target**: Temporary preview URLs
- **Process**: Build → Deploy → Comment PR with preview URL

### GitHub Actions Workflows

#### CI Pipeline (`.github/workflows/ci.yml`)
- Runs on push to `main`/`develop` and PRs to `main`
- TypeScript checking with `astro check`
- Production build testing
- Artifact upload

#### Deployment Pipeline (`.github/workflows/deploy.yml`)
- Deploys to Vercel on push to `main`
- Preview deployments for PRs
- Uses Vercel CLI for deployment

### Required Secrets

For deployment to work, these secrets must be configured in GitHub:

```
VERCEL_TOKEN          # Vercel API token
VERCEL_ORG_ID         # Organization ID
VERCEL_PROJECT_ID     # Project ID
```

### Manual Deployment

If needed, you can deploy manually:

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

## Performance Optimization

### Built-in Optimizations

- **Static Generation**: All pages pre-rendered
- **Asset Optimization**: Images, CSS, and JS optimized
- **Font Loading**: Optimized font loading with preconnect
- **Minimal JavaScript**: Only necessary JS included

### Monitoring

- **Vercel Analytics**: Page views, performance metrics
- **Core Web Vitals**: Automatic tracking
- **Build Performance**: CI monitors build times

## Troubleshooting

### Common Issues

#### TypeScript Errors
```bash
# Check for type errors
pnpm astro check

# Common fixes:
# - Ensure all props have proper types
# - Use proper DOM element casting: (element as HTMLElement)
# - Check import paths are correct
```

#### Build Failures
```bash
# Clear cache and rebuild
rm -rf node_modules/.cache
rm -rf dist
pnpm install
pnpm build
```

#### Node Version Issues
```bash
# Use correct Node.js version
nvm use
# or
nvm install 20
nvm use 20
```

### Development Server Issues

- **Port conflicts**: Development server runs on `:4321`
- **Hot reload**: Automatic reload on file changes
- **Cache issues**: Restart dev server if needed

### Vercel Deployment Issues

- **Build failures**: Check build logs in Vercel dashboard
- **Environment**: Ensure correct Node.js version in Vercel settings
- **Analytics**: May take time to appear after deployment

## Testing

### Type Safety
```bash
pnpm astro check        # TypeScript validation
```

### Build Testing
```bash
pnpm build             # Production build test
pnpm preview           # Test built site locally
```

### Manual Testing Checklist

- [ ] All pages load correctly
- [ ] Blog posts render with proper formatting
- [ ] Table of Contents works and is collapsible
- [ ] Dark mode toggle functions
- [ ] Mobile responsiveness
- [ ] Form submissions (contact page)
- [ ] Search and filtering (blog page)
- [ ] Print functionality (CV page)

## Contributing Guidelines

### Code Review Process

1. **Create PR** with descriptive title and description
2. **Automated checks** must pass (CI pipeline)
3. **Manual review** by maintainer
4. **Testing** on preview deployment
5. **Merge** to main branch

### Commit Messages

Use conventional commit format:

```
feat: add new component
fix: resolve navigation bug
docs: update component documentation
style: improve button styling
refactor: simplify authentication logic
```

### Component Development

When creating new components:

1. **Define Props Interface**: Clear TypeScript interfaces
2. **Follow Design System**: Use consistent colors and spacing
3. **Add Documentation**: Include in `docs/components.md`
4. **Test Responsiveness**: Ensure mobile compatibility
5. **Dark Mode Support**: Implement dark mode variants

This ensures consistency and maintainability across the entire codebase.