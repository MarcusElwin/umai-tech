# Blog Post Scripts

This directory contains scripts to help you create new blog posts for the Umai Tech website.

## Scripts Available

### 1. Interactive Node.js Script (`new-blog-post.js`)

**Usage:**
```bash
npm run new-post
```

**Features:**
- Interactive prompts for title, description, and tags
- Suggests popular tags
- Option to add initial content
- Creates image directory automatically
- Validates input and prevents duplicates
- Colorful terminal output

### 2. Quick Shell Script (`new-post.sh`)

**Usage:**
```bash
npm run new-post:quick "Blog Post Title" "Description" "tag1,tag2,tag3"
```

**Example:**
```bash
npm run new-post:quick "Getting Started with Claude AI" "A comprehensive guide to using Claude AI for development tasks" "AI,Machine Learning,Claude,Development"
```

**Features:**
- Fast one-command creation
- Automatic slug generation
- Creates image directory
- Basic template with callout example

## What Gets Created

When you run either script, it will:

1. **Create the blog post file**: `src/content/blog/{slug}.mdx`
2. **Create image directory**: `public/images/blog/{slug}/`
3. **Generate proper frontmatter** with:
   - Title and description
   - Publication and update dates
   - Author (Marcus Elwin)
   - Tags array
4. **Include basic template** with:
   - Callout component import
   - Sample sections
   - Example callout usage

## Blog Post Structure

### Frontmatter
```yaml
---
title: "Your Blog Post Title"
description: "Brief description of the post"
pubDate: 2025-01-25T10:00:00.000Z
updatedDate: 2025-01-25T10:00:00.000Z
author: "Marcus Elwin"
tags: ["Tag1", "Tag2", "Tag3"]
---
```

### Content Structure
```mdx
import Callout from '@components/Callout.astro';

## Introduction
Your introduction here...

<Callout type="info" title="Pro Tip">
Use callouts to highlight important information!
</Callout>

## Main Content
Your main content sections...

## Conclusion
Wrap up your thoughts...
```

## Available Callout Types

- `info` - Blue info callouts
- `warning` - Yellow warning callouts  
- `error` - Red error callouts
- `success` - Green success callouts

## Adding Images

1. Place images in: `public/images/blog/{slug}/`
2. Reference in markdown: `![Alt text](/images/blog/{slug}/image.png)`

## Popular Tags

The interactive script suggests these popular tags:
- Artificial Intelligence
- Machine Learning
- Large Language Models
- Generative AI
- Deep Learning
- Natural Language Processing
- Data Science
- Python
- TypeScript
- And many more...

## Development Workflow

1. Create new post: `npm run new-post`
2. Add content to the generated `.mdx` file
3. Add images to the created image directory
4. Start dev server: `npm run dev`
5. Preview at: `http://localhost:4321/blog/{slug}`

## Tips

- **Slug generation**: Titles are automatically converted to URL-friendly slugs
- **Duplicate prevention**: Scripts check for existing posts with the same slug
- **Image organization**: Each post gets its own image directory
- **Component usage**: Import and use Astro components like Callout
- **SEO friendly**: Proper frontmatter ensures good SEO