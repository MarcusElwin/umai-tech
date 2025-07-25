#!/usr/bin/env node
/**
 * Umai Tech Blog Post Generator
 * Creates a new blog post with proper frontmatter and structure
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Color codes for terminal output
const colors = {
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Helper function to prompt user input
function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

// Helper function to format slug from title
function createSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim('-'); // Remove leading/trailing hyphens
}

// Helper function to format date for frontmatter
function formatDate(date) {
  return date.toISOString();
}

// Popular tag suggestions
const suggestedTags = [
  'Artificial Intelligence',
  'Machine Learning', 
  'Large Language Models',
  'Generative AI',
  'Deep Learning',
  'Natural Language Processing',
  'Data Science',
  'Python',
  'TypeScript',
  'React',
  'Astro',
  'Web Development',
  'DevOps',
  'Cloud Computing',
  'AWS',
  'GCP',
  'Azure',
  'Prompt Engineering',
  'LLMOps',
  'MLOps',
  'Data Engineering',
  'Analytics',
  'Startup',
  'Product Management',
  'Leadership'
];

// Generate blog post template
function generateBlogPostTemplate(data) {
  const template = `---
title: "${data.title}"
description: "${data.description}"
pubDate: ${formatDate(new Date())}
updatedDate: ${formatDate(new Date())}
author: "Marcus Elwin"
tags: [${data.tags.map(tag => `"${tag}"`).join(', ')}]
---

import Callout from '@components/Callout.astro';

${data.content || `## Introduction

Write your blog post content here...

<Callout type="info" title="Pro Tip">
Use callout components to highlight important information!
</Callout>

## Section 1

Add your sections here...

## Conclusion

Wrap up your thoughts...`}
`;
  return template;
}

// Create image directory for the blog post
function createImageDirectory(slug) {
  const imageDir = path.join(__dirname, '..', 'public', 'images', 'blog', slug);
  
  if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir, { recursive: true });
    console.log(`${colors.green}✓${colors.reset} Created image directory: ${colors.blue}public/images/blog/${slug}/${colors.reset}`);
  }
  
  return imageDir;
}

// Main function
async function createBlogPost() {
  console.log(`\n${colors.bold}${colors.blue}🚀 Umai Tech Blog Post Generator${colors.reset}\n`);
  
  try {
    // Get blog post details
    const title = await prompt(`${colors.yellow}Blog post title:${colors.reset} `);
    if (!title.trim()) {
      console.log(`${colors.red}Error: Title is required${colors.reset}`);
      process.exit(1);
    }
    
    const description = await prompt(`${colors.yellow}Brief description:${colors.reset} `);
    if (!description.trim()) {
      console.log(`${colors.red}Error: Description is required${colors.reset}`);
      process.exit(1);
    }
    
    // Generate slug
    const slug = createSlug(title);
    console.log(`${colors.green}Generated slug:${colors.reset} ${slug}`);
    
    // Check if slug already exists
    const blogDir = path.join(__dirname, '..', 'src', 'content', 'blog');
    const filePath = path.join(blogDir, `${slug}.mdx`);
    
    if (fs.existsSync(filePath)) {
      console.log(`${colors.red}Error: Blog post with slug "${slug}" already exists${colors.reset}`);
      process.exit(1);
    }
    
    // Get tags
    console.log(`\n${colors.yellow}Popular tags:${colors.reset}`);
    suggestedTags.slice(0, 12).forEach((tag, index) => {
      console.log(`  ${index + 1}. ${tag}`);
    });
    
    const tagsInput = await prompt(`\n${colors.yellow}Tags (comma-separated):${colors.reset} `);
    const tags = tagsInput
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
    
    if (tags.length === 0) {
      console.log(`${colors.red}Error: At least one tag is required${colors.reset}`);
      process.exit(1);
    }
    
    // Ask if they want to add initial content
    const addContent = await prompt(`\n${colors.yellow}Add initial content? (y/N):${colors.reset} `);
    let content = '';
    
    if (addContent.toLowerCase() === 'y' || addContent.toLowerCase() === 'yes') {
      console.log(`${colors.blue}Enter your content (press Ctrl+D when finished):${colors.reset}`);
      content = await new Promise((resolve) => {
        let inputContent = '';
        process.stdin.on('data', (chunk) => {
          inputContent += chunk;
        });
        process.stdin.on('end', () => {
          resolve(inputContent.trim());
        });
      });
    }
    
    // Generate blog post
    const blogPostData = {
      title,
      description,
      tags,
      content
    };
    
    const blogPostContent = generateBlogPostTemplate(blogPostData);
    
    // Create the blog post file
    fs.writeFileSync(filePath, blogPostContent, 'utf8');
    
    // Create image directory
    createImageDirectory(slug);
    
    // Success message
    console.log(`\n${colors.green}${colors.bold}✅ Blog post created successfully!${colors.reset}`);
    console.log(`${colors.green}📝 File:${colors.reset} ${colors.blue}src/content/blog/${slug}.mdx${colors.reset}`);
    console.log(`${colors.green}🖼️  Images:${colors.reset} ${colors.blue}public/images/blog/${slug}/${colors.reset}`);
    console.log(`${colors.green}🌐 URL:${colors.reset} ${colors.blue}http://localhost:4321/blog/${slug}${colors.reset}`);
    
    // Quick reference
    console.log(`\n${colors.yellow}${colors.bold}Quick Reference:${colors.reset}`);
    console.log(`${colors.yellow}• Add images to:${colors.reset} public/images/blog/${slug}/`);
    console.log(`${colors.yellow}• Reference images:${colors.reset} ![Alt text](/images/blog/${slug}/image.png)`);
    console.log(`${colors.yellow}• Use callouts:${colors.reset} <Callout type="info" title="Title">Content</Callout>`);
    console.log(`${colors.yellow}• Callout types:${colors.reset} info, warning, error, success`);
    console.log(`${colors.yellow}• Start dev server:${colors.reset} npm run dev`);
    
  } catch (error) {
    console.error(`${colors.red}Error creating blog post:${colors.reset}`, error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Run the script
createBlogPost();