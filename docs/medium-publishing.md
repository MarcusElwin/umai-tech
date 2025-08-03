# Medium Publishing Guide

This guide shows you how to convert your MDX blog posts to Medium-compatible format. Note: Medium's API is deprecated, so we use conversion + manual publishing or URL import.

## Quick Start

### 1. Convert a Post to Medium Format

```bash
# Convert to file (recommended first step)
pnpm convert-to-medium agentic-commerce-the-dawn-of-a-new-ai-driven-era-for-ecommerce

# Output will be saved to: dist/agentic-commerce-the-dawn-of-a-new-ai-driven-era-for-ecommerce-medium.md
```

### 2. Publishing Options

#### Option A: Copy & Paste (Recommended)
1. Copy content from the generated `.md` file
2. Go to https://medium.com/new-story
3. Paste the content
4. Review and adjust formatting
5. Add header image and publish

#### Option B: URL Import
1. Ensure your post is live at: `https://umai-tech.com/blog/[slug]`
2. Go to https://medium.com/p/import
3. Enter your blog post URL
4. Medium will import and convert automatically
5. Review imported content and publish

#### Option C: GitHub Gist Import
1. Create a new Gist with your converted content
2. Use the Gist URL for Medium import
3. Good for posts with complex formatting

## What Gets Converted

### ✅ Preserved Elements
- **Headings** (H1-H6)
- **Bold/Italic** text formatting
- **Links** and URLs
- **Lists** (bulleted and numbered)
- **Images** (with alt text)
- **Code blocks** and inline code
- **Quotes** and blockquotes

### 🔄 Converted Components
- **Callout** → Styled blockquotes with titles
- **Citation** → Formatted quotes with attribution
- **ResearchInsights** → Structured data sections
- **Custom components** → "[Interactive Component - See Original Post]" placeholder

### ❌ Removed Elements
- Import statements
- MDX-specific syntax
- Astro component props
- Complex interactive elements

## Generated Output Structure

```markdown
# Your Post Title

*Optional subtitle/description*

[Converted content with Medium-compatible formatting]

---

*Originally published at [umai-tech.com](https://umai-tech.com)*

Tags: tag1, tag2, tag3
```

## Medium API Limitations

- **Draft Mode**: Posts are created as drafts for review
- **5 Tag Limit**: Only first 5 tags are used
- **No Updates**: Can't update existing posts via API
- **Basic Formatting**: Some advanced formatting may be lost

## Alternative Solutions

### 1. **markdown-to-medium-tool** (Web-based)
- Visit: http://markdown-to-medium.surge.sh/
- Paste your converted content
- Copy HTML output to Medium

### 2. **Manual Copy-Paste** (Most reliable)
- Use our converted `.md` file
- Manually paste into Medium editor
- Best formatting preservation

### 3. **Third-party Tools**
- **Zapier**: Automate posting workflows
- **IFTTT**: Simple automation triggers
- **Buffer/Hootsuite**: Social media scheduling

## Troubleshooting

### Common Issues

**Missing Dependencies:**
```bash
pnpm install node-fetch
```

**Permission Errors:**
```bash
chmod +x scripts/convert-to-medium.js
```

**Medium API Errors:**
- Check your integration token is valid
- Verify user ID is correct
- Ensure you have publishing permissions

### Content Issues

**Complex Components:** 
- Review converted output before publishing
- Manually add context for removed components
- Consider linking back to original post

**Formatting Problems:**
- Use the web-based markdown-to-medium-tool for better HTML
- Manual copy-paste often works best
- Check Medium's formatting guidelines

## Best Practices

1. **Always Review**: Check converted content before publishing
2. **Start with Drafts**: Use draft mode for initial tests
3. **Add Context**: Explain removed interactive elements
4. **Link Back**: Include link to original post
5. **Optimize for Medium**: Adapt content for Medium's audience

## Environment Variables

Add to your `.env` file or set in your shell:

```bash
MEDIUM_TOKEN=your_integration_token_here
MEDIUM_USER_ID=your_user_id_here
```

## Script Options

```bash
# Basic conversion
pnpm convert-to-medium <post-slug>

# With automatic publishing
pnpm convert-to-medium <post-slug> --publish

# Get help
pnpm convert-to-medium
```

## Example Workflow

```bash
# 1. Convert post
pnpm convert-to-medium my-awesome-post

# 2. Review generated file
cat dist/my-awesome-post-medium.md

# 3. Test publish as draft
MEDIUM_TOKEN="..." MEDIUM_USER_ID="..." pnpm convert-to-medium my-awesome-post --publish

# 4. Check Medium drafts and publish manually
```

This approach gives you maximum control while automating the tedious conversion work!