# Content Management Guide

This guide covers how to create, manage, and optimize content for the Umai Tech website.

## Blog Posts

### Creating New Posts

Blog posts are written in MDX format and stored in `src/content/blog/`. Each post requires frontmatter and can include interactive components.

#### File Structure
```
src/content/blog/
├── my-post-title.mdx
├── my-post-title/
│   ├── index.mdx
│   └── images/
└── ...
```

#### Required Frontmatter

```yaml
---
title: "Your Post Title"
description: "Brief description for SEO and previews"
pubDate: 2024-01-15
author: "Marcus Elwin"
tags: ["AI", "Machine Learning", "GenAI"]
heroImage: "/images/blog/hero-image.jpg"
---
```

#### Optional Frontmatter

```yaml
---
# ... required fields ...
draft: true                    # Hide from production
canonicalURL: "https://..."   # Original source URL
readTime: "8 min read"        # Manual override
socialImage: "/og-image.jpg"   # Custom social share image
---
```

### Content Guidelines

#### Writing Style
- **Tone**: Professional yet approachable
- **Voice**: Authoritative but not condescending
- **Language**: Technical content accessible to diverse audiences
- **Length**: 1,000-3,000 words for optimal SEO

#### Structure
1. **Hook**: Compelling opening that addresses a problem
2. **Context**: Background information and relevance
3. **Main Content**: Core insights, examples, code snippets
4. **Conclusion**: Key takeaways and next steps
5. **Call-to-Action**: Engagement opportunity

#### Technical Content
- Use code blocks with proper syntax highlighting
- Include working examples when possible
- Explain complex concepts progressively
- Provide links to additional resources

### MDX Components

#### Built-in Components

```mdx
<!-- Callouts for important information -->
<Callout type="warning" title="Important">
This is a warning message.
</Callout>

<!-- Mermaid diagrams -->
<Mermaid code={`
graph TD;
    A[Start] --> B[Process]
    B --> C[End]
`} />

<!-- Reading time (automatically calculated) -->
<ReadingTime content={content} />
```

#### Component Types
- `Callout`: info, warning, error, success, note
- `Mermaid`: Interactive diagrams and flowcharts
- `ReadingTime`: Automatic reading time calculation

### SEO Optimization

#### Meta Tags
All posts automatically generate:
- Title tags with site branding
- Meta descriptions from frontmatter
- Open Graph tags for social sharing
- Twitter Card metadata
- Canonical URLs

#### Best Practices
- **Title**: 50-60 characters, include primary keyword
- **Description**: 150-160 characters, compelling summary
- **Tags**: 3-8 relevant tags, mix technical and industry terms
- **Images**: Include hero image, optimize for web (WebP preferred)

### Tagging System

#### Available Tags
- **Technologies**: "AI", "Machine Learning", "GenAI", "Python", "TypeScript"
- **Industries**: "Legal Tech", "FinTech", "Healthcare", "Education"
- **Topics**: "Strategy", "Implementation", "Tutorial", "Analysis"
- **Formats**: "Case Study", "Deep Dive", "Quick Tips", "Interview"

#### Tag Guidelines
- Use existing tags when possible
- Maximum 8 tags per post
- Include 1-2 primary keywords
- Add 1-2 industry/topic tags
- Consider target audience

## Content Collections Schema

The content is managed through Astro's Content Collections with TypeScript validation:

```typescript
// src/content/config.ts
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    author: z.string(),
    tags: z.array(z.string()),
    heroImage: z.string().optional(),
    draft: z.boolean().default(false),
    canonicalURL: z.string().url().optional(),
    readTime: z.string().optional(),
    socialImage: z.string().optional(),
  }),
});
```

## Images and Media

### File Organization
```
public/images/
├── blog/
│   ├── hero-images/
│   ├── post-content/
│   └── thumbnails/
├── og-images/
└── general/
```

### Image Guidelines
- **Format**: WebP for web, fallback to PNG/JPG
- **Hero Images**: 1200x630px (1.91:1 ratio)
- **Content Images**: Max width 800px
- **File Names**: kebab-case, descriptive
- **Alt Text**: Descriptive, include relevant keywords

### Optimization
- Use Astro's built-in image optimization
- Provide multiple sizes for responsive design
- Include loading="lazy" for below-fold images

## Publishing Workflow

### Development Process
1. **Create Branch**: `git checkout -b content/post-title`
2. **Write Content**: Create MDX file with frontmatter
3. **Preview**: `pnpm dev` to test locally
4. **Review**: Check typography, links, images
5. **Type Check**: `pnpm astro check` for validation
6. **Commit**: Push changes and create PR

### Content Review Checklist
- [ ] Frontmatter complete and accurate
- [ ] Hero image optimized and relevant
- [ ] All links functional (internal and external)
- [ ] Code examples tested and working
- [ ] Typography and formatting consistent
- [ ] SEO elements optimized
- [ ] Mobile-friendly layout
- [ ] Reading time appropriate for content depth

### Publication
- **Draft Mode**: Set `draft: true` for work-in-progress
- **Scheduling**: Use future `pubDate` for scheduled posts
- **Updates**: Edit existing files, maintain URL structure

## Content Strategy

### Editorial Calendar
- **Weekly**: 1-2 technical posts
- **Monthly**: 1 industry analysis or case study
- **Quarterly**: Major thought leadership pieces

### Content Pillars
1. **Technical Tutorials**: How-to guides and implementations
2. **Industry Insights**: Analysis and trend commentary  
3. **Case Studies**: Real-world project examples
4. **Thought Leadership**: Strategic perspectives on AI/tech

### Audience Segments
- **Technical Practitioners**: Developers, data scientists, engineers
- **Business Leaders**: CTOs, VPs of Engineering, startup founders
- **Industry Observers**: Analysts, journalists, students

## Analytics and Performance

### Tracking
- Page views via Vercel Analytics
- Reading time and engagement metrics
- Popular content identification
- Traffic source analysis

### Content Optimization
- Monitor high-performing posts for topic inspiration
- A/B test headlines and descriptions
- Update older content with new information
- Cross-link related articles for SEO

### Performance Metrics
- **Page Load Speed**: <3 seconds
- **Reading Completion**: >60% for long-form content
- **Social Sharing**: Track engagement on social platforms
- **Search Rankings**: Monitor keyword positions

This content management system ensures consistent, high-quality content that serves both technical and business audiences while maintaining excellent SEO performance.