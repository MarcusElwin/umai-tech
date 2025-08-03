#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Convert MDX blog post to Medium-compatible format
 * Usage: node scripts/convert-to-medium.js <blog-post-slug>
 */

function convertMDXToMedium(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Extract frontmatter
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n/);
    const frontmatter = frontmatterMatch ? frontmatterMatch[1] : '';
    const body = content.replace(/^---\n[\s\S]*?\n---\n/, '');
    
    // Parse frontmatter
    const metadata = {};
    frontmatter.split('\n').forEach(line => {
      const [key, ...values] = line.split(':');
      if (key && values.length) {
        const value = values.join(':').trim().replace(/^["']|["']$/g, '');
        metadata[key.trim()] = value;
      }
    });
    
    // Convert body content
    let mediumContent = body;
    
    // Remove import statements
    mediumContent = mediumContent.replace(/^import .+$/gm, '');
    
    // Convert custom components to Medium-compatible format
    mediumContent = convertComponents(mediumContent);
    
    // Clean up extra whitespace
    mediumContent = mediumContent.replace(/\n{3,}/g, '\n\n');
    
    return {
      title: metadata.title || 'Untitled',
      subtitle: metadata.description || '',
      content: mediumContent.trim(),
      tags: metadata.tags ? JSON.parse(metadata.tags) : [],
      author: metadata.author || 'Marcus Elwin'
    };
    
  } catch (error) {
    console.error('Error converting MDX:', error);
    return null;
  }
}

function convertComponents(content) {
  let converted = content;
  
  // Convert Callout components to blockquotes
  converted = converted.replace(
    /<Callout[^>]*title="([^"]*)"[^>]*>([\s\S]*?)<\/Callout>/g,
    (_, title, body) => {
      const cleanBody = body.replace(/<[^>]*>/g, '').trim();
      return `> **${title}**\n> \n> ${cleanBody}`;
    }
  );
  
  // Convert Citation components to styled quotes
  converted = converted.replace(
    /<Citation[^>]*author="([^"]*)"[^>]*source="([^"]*)"[^>]*>([\s\S]*?)<\/Citation>/g,
    (_, author, source, quote) => {
      const cleanQuote = quote.replace(/<[^>]*>/g, '').trim();
      return `> *"${cleanQuote}"*\n> \n> — ${author}, ${source}`;
    }
  );
  
  // Convert ResearchInsights to formatted sections
  converted = converted.replace(
    /<ResearchInsights[^>]*title="([^"]*)"[^>]*>([\s\S]*?)<\/ResearchInsights>/g,
    (_, title, content) => {
      // Format as Medium-compatible content  
      let result = `## ${title}\n\n`;
      
      // Look for Walmart Strategy
      if (content.includes('Walmart Strategy')) {
        result += `**Walmart Strategy**: 50% revenue target through AI agents (5 years)\n`;
        result += `*Incumbent validation - retail giants are all-in*\n\n`;
      }
      
      // Look for B2B Negotiations
      if (content.includes('Pactum AI')) {
        result += `**B2B Negotiations (Pactum AI)**: 40% cost savings in autonomous negotiations\n`;
        result += `*Proven ROI - agents outperform humans*\n\n`;
      }
      
      // Look for Infrastructure/Technical
      if (content.includes('Technical convergence') || content.includes('Infrastructure')) {
        result += `**Infrastructure Ready**: Technical convergence enables scale\n`;
        result += `*Payment rails + APIs + composable checkout ready*\n\n`;
      }
      
      return result;
    }
  );
  
  // Remove other custom components (replace with fallback text)
  converted = converted.replace(/<[A-Z][^>]*\/>/g, '[Interactive Component - See Original Post]');
  converted = converted.replace(/<[A-Z][^>]*>[\s\S]*?<\/[A-Z][^>]*>/g, '[Interactive Component - See Original Post]');
  
  // Convert special formatting
  converted = converted.replace(/\*\*([^*]+)\*\*/g, '**$1**'); // Keep bold
  converted = converted.replace(/\*([^*]+)\*/g, '*$1*'); // Keep italic
  
  return converted;
}

async function generateImportUrl(_article) {
  // Generate a GitHub Gist or use existing blog URL for Medium import
  console.log('\n📌 Medium Import Options:');
  console.log('1. Copy the converted content and paste directly into Medium');
  console.log('2. Import from your blog URL: https://umai-tech.com/blog/[slug]');
  console.log('3. Create a GitHub Gist and import from there');
  
  return null;
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage: node scripts/convert-to-medium.js <blog-post-slug>');
    console.log('Example: node scripts/convert-to-medium.js agentic-commerce-the-dawn-of-a-new-ai-driven-era-for-ecommerce');
    process.exit(1);
  }
  
  const slug = args[0];
  
  const blogPath = path.join(__dirname, '..', 'src', 'content', 'blog', `${slug}.mdx`);
  
  if (!fs.existsSync(blogPath)) {
    console.error(`❌ Blog post not found: ${blogPath}`);
    process.exit(1);
  }
  
  console.log(`🔄 Converting ${slug} to Medium format...`);
  
  const article = convertMDXToMedium(blogPath);
  
  if (!article) {
    console.error('❌ Failed to convert article');
    process.exit(1);
  }
  
  // Save converted content to file
  const outputPath = path.join(__dirname, '..', 'dist', `${slug}-medium.md`);
  const outputDir = path.dirname(outputPath);
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const mediumOutput = `# ${article.title}

${article.subtitle ? `*${article.subtitle}*\n\n` : ''}${article.content}

---

*Originally published at [umai-tech.com](https://umai-tech.com)*

Tags: ${article.tags.join(', ')}`;
  
  fs.writeFileSync(outputPath, mediumOutput);
  console.log(`✅ Converted content saved to: ${outputPath}`);
  
  // Show import options
  await generateImportUrl(article);
  
  console.log('\n✨ Next Steps:');
  console.log('1. Copy content from:', outputPath);
  console.log('2. Go to: https://medium.com/new-story');
  console.log('3. Paste and review formatting');
  console.log('4. Or use Medium Import: https://medium.com/p/import');
  console.log('   - Import from: https://umai-tech.com/blog/' + slug);
}

main().catch(console.error);