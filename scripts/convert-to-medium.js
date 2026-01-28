#!/usr/bin/env node
/**
 * Umai Tech Blog to Medium Converter
 * Converts MDX blog posts with custom Astro components to Medium-compatible Markdown
 *
 * Usage:
 *   pnpm convert-to-medium <url-or-slug>
 *   pnpm convert-to-medium https://www.umai-tech.com/blog/the-third-path-player-coach-at-scale
 *   pnpm convert-to-medium the-third-path-player-coach-at-scale
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Color codes for terminal output
const colors = {
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m'
};

// Callout type to emoji mapping for Medium
const calloutEmojis = {
  info: 'ℹ️',
  warning: '⚠️',
  error: '🚫',
  success: '✅',
  note: '📝',
  insight: '💡'
};

/**
 * Extract slug from URL or use directly if it's already a slug
 */
function extractSlug(input) {
  // Handle full URLs
  if (input.startsWith('http://') || input.startsWith('https://')) {
    const url = new URL(input);
    const pathParts = url.pathname.split('/').filter(Boolean);
    // Expecting /blog/<slug>
    if (pathParts[0] === 'blog' && pathParts[1]) {
      return pathParts[1];
    }
    // Just return the last path segment
    return pathParts[pathParts.length - 1];
  }
  // Already a slug
  return input;
}

/**
 * Find the blog post file by slug
 */
function findBlogPost(slug) {
  const blogDir = path.join(__dirname, '..', 'src', 'content', 'blog');
  const mdxFile = path.join(blogDir, `${slug}.mdx`);
  const mdFile = path.join(blogDir, `${slug}.md`);

  if (fs.existsSync(mdxFile)) {
    return mdxFile;
  }
  if (fs.existsSync(mdFile)) {
    return mdFile;
  }

  // Try to find partial match
  const files = fs.readdirSync(blogDir);
  const match = files.find(f => f.includes(slug));
  if (match) {
    return path.join(blogDir, match);
  }

  return null;
}

/**
 * Parse frontmatter from MDX content
 */
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return { frontmatter: {}, body: content };
  }

  const frontmatterStr = match[1];
  const body = content.slice(match[0].length).trim();

  // Simple YAML parser for our use case
  const frontmatter = {};
  const lines = frontmatterStr.split('\n');

  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();

      // Handle quoted strings
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }

      // Handle arrays
      if (value.startsWith('[')) {
        try {
          value = JSON.parse(value.replace(/'/g, '"'));
        } catch {
          // Keep as string if parsing fails
        }
      }

      frontmatter[key] = value;
    }
  }

  return { frontmatter, body };
}

/**
 * Convert Callout component to Medium-compatible blockquote
 */
function convertCallout(type, title, content) {
  const emoji = calloutEmojis[type] || 'ℹ️';
  const cleanContent = content.trim()
    .split('\n')
    .map(line => line.trim())
    .filter(line => line)
    .join('\n> ');

  if (title) {
    return `\n> ${emoji} **${title}**\n>\n> ${cleanContent}\n`;
  }
  return `\n> ${emoji} ${cleanContent}\n`;
}

/**
 * Convert Citation component to Medium-compatible blockquote
 */
function convertCitation(content, author, source, url) {
  let attribution = '';
  if (author) {
    attribution = `— ${author}`;
  }
  if (source) {
    if (url) {
      attribution += attribution ? `, [${source}](${url})` : `[${source}](${url})`;
    } else {
      attribution += attribution ? `, *${source}*` : `*${source}*`;
    }
  }

  const cleanContent = content.trim().replace(/<[^>]*>/g, '');
  return `\n> *"${cleanContent}"*\n>\n> ${attribution}\n`;
}

/**
 * Convert ThreePathsComparison to Medium-compatible table/text
 */
function convertThreePathsComparison(propsStr) {
  let output = `
---

### The Three Engineering Archetypes

**How AI is reshaping traditional career paths in software engineering**

#### 1. The Super IC
*Maximum Individual Output*

Leverage AI tools for massive personal productivity. Ship what used to require a team.

**Strengths:**
- 10-50x individual output with AI tooling
- Direct control over implementation
- Clear, measurable impact
- Minimal coordination overhead

**Tradeoffs:**
- Limited organizational influence
- Scalability ceiling without delegation
- May miss strategic context
- Career progression can plateau

*Examples: Pieter Levels, Indie Hackers, Staff Engineers*

---

#### 2. The Product Engineer
*Full Product Ownership*

Own the entire product lifecycle. Use AI for implementation while focusing on what to build and why.

**Strengths:**
- End-to-end product ownership
- Strong user empathy and business context
- Strategic influence on roadmap
- Valued across company sizes

**Tradeoffs:**
- May lose deep technical edge
- Dependent on AI for implementation speed
- Less hands-on with complex systems
- Risk of becoming 'idea person' only

*Examples: PostHog Engineers, Vercel Product Engineers, Startup CTOs*

---

#### 3. The Player-Coach
*Strategic Output at Scale*

Refuse to choose. Keep strategic context and stakeholder relationships while shipping directly. AI removes the tradeoff that forced the choice.

**Strengths:**
- Strategic altitude + direct output
- Deep organizational context as multiplier
- Flexible between modes as needed
- Maximum leverage through judgment + AI

**Tradeoffs:**
- Requires maintaining technical currency
- Context-switching between modes
- Must actively resist pure-coordination drift
- Harder to define clear role boundaries

*Examples: Technical Leads, Principal Engineers, AI-First Founders*

---

> 💡 **The Key Insight:** AI doesn't force you to choose between these paths—it enables a new synthesis. The Player-Coach combines the **output capacity** of a Super IC with the **strategic judgment** of a Product Engineer and the **organizational context** of a traditional lead.

---
`;
  return output;
}

/**
 * Convert ProfileComparison (radar chart) to text table
 */
function convertProfileComparison(propsStr) {
  return `
---

### Skill Profile Comparison

*Toggle profiles on/off to compare archetypes—including the mythical ones.*

| Profile | Output | Strategy | Context | AI Leverage | Leadership |
|---------|--------|----------|---------|-------------|------------|
| **Super IC** | 95% | 45% | 40% | 90% | 25% |
| **Product Engineer** | 60% | 90% | 70% | 65% | 55% |
| **Player-Coach** | 80% | 85% | 90% | 85% | 75% |
| **Unicorn (Myth)** | 98% | 95% | 95% | 95% | 95% |
| **Renaissance Engineer** | 75% | 80% | 60% | 80% | 60% |

The radar tells the story: the Super IC spikes on output and AI leverage but craters on strategy and leadership. The Product Engineer inverts this—strong strategy, weaker direct output. The Player-Coach doesn't win any single dimension outright, but maintains **competitive scores across all five**. That balance is what AI makes possible.

*Note: These scores are illustrative of relative strengths and tradeoffs, not empirically measured metrics.*

---
`;
}

/**
 * Convert CareerFilter to text representation
 */
function convertCareerFilter(propsStr) {
  return `
---

### The New Career Filter

*AI tools don't eliminate the need for coordination, strategy, or leadership. They eliminate the excuse that those activities preclude direct contribution.*

> **"Can you produce artifacts, or do you only produce meetings?"**

**✅ Thriving:**

- **The Shipping Lead** — Still writes code, reviews PRs deeply, and can jump into production issues
- **The Architect Who PRs** — Designs systems AND implements critical paths, not just draws diagrams
- **The Strategic Implementer** — Owns roadmap AND delivers key features, using AI to maintain both
- **The Context-Rich Builder** — Applies years of judgment directly through AI-assisted development

**🚫 At Risk:**

- **The Ticket Router** — Main output is moving items between columns and attending standups
- **The Diagram Architect** — Draws systems but hasn't touched production code in years
- **The Meeting Facilitator** — "Provides guidance" through spec documents and feedback sessions only
- **The Pure Coordinator** — Valuable for alignment but creates no technical artifacts

---
`;
}

/**
 * Convert CareerPathEvolution to text
 */
function convertCareerPathEvolution() {
  return `
---

### Career Path Evolution

**Traditional Model (Pre-AI):**

\`\`\`
Engineer → Senior → Staff IC (technical depth)
                 ↘
                   Manager → Director (leadership track)
\`\`\`

**AI-Enabled Model:**

\`\`\`
Engineer → Senior → Player-Coach at Scale
                    (combines technical output + strategic leadership)
\`\`\`

The traditional model forced a binary fork—you chose scaling through others (management) or scaling through yourself (IC). Either path had a ceiling. The AI-enabled model collapses this fork. You can now scale through *both* paths simultaneously because the execution bottleneck that forced the choice no longer applies.

---
`;
}

/**
 * Convert LeverageFormula to text
 */
function convertLeverageFormula() {
  return `
---

### The Leverage Formula

\`\`\`
Leverage = (Deep Context × AI Fluency) / Implementation Friction
\`\`\`

**Where:**

- **Deep Context** = Years of institutional knowledge, failed projects, political minefields, technical debt insights
- **AI Fluency** = Ability to effectively direct AI tools with the right context (not just prompt engineering)
- **Implementation Friction** = Traditional coding overhead (now highly compressible with AI)

**The insight:** Give two engineers the same AI assistant—one with deep organizational context, one without—and you'll see dramatically different outputs. The context-rich engineer gets production-ready code that fits the system. The context-poor engineer gets generic solutions that require extensive rework.

---
`;
}

/**
 * Convert SkillsRadar to text/table
 */
function convertSkillsRadar(propsStr) {
  return `
---

### The Player-Coach Competency Model

*Click any skill to learn how to develop it*

**1. Context Engineering (90%)**

The ability to know what context to give AI and when. This isn't prompt engineering (that's table stakes). It's understanding which pieces of your organizational knowledge, technical history, and strategic context will make AI output actually useful versus generically correct.

*How to develop:* Deliberately experiment with context levels. Try giving AI minimal context, then maximal context, then curated context. Notice which produces the best results fastest.

**2. Rapid Validation (85%)**

When AI generates code at 10x speed, your bottleneck becomes evaluation speed. Can you quickly assess whether generated code is correct, secure, maintainable, and aligned with system patterns?

*How to develop:* Practice reading code faster than you write it. Review AI output the way you'd review a junior developer's PR—but compress the feedback loop to minutes, not days.

**3. Strategic Altitude (80%)**

The hardest skill: staying zoomed out enough to make good decisions while zoomed in enough to ship. Most people drift toward one extreme.

*How to develop:* Timebox ruthlessly. Use 2-hour "player" blocks and 1-hour "coach" blocks. The calendar structure prevents drift.

**4. AI Skepticism (75%)**

As Addy Osmani puts it: "What distinguishes great developers is knowing when AI is wrong." AI is confidently incorrect often enough that blind trust is career-limiting.

*How to develop:* Keep a log of AI mistakes for a month. You'll start pattern-matching the conditions where AI fails—usually edge cases, security implications, and anything requiring deep system context.

**5. Delegation Judgment (70%)**

Not everything deserves your direct attention. The Player-Coach still delegates—to humans for people-intensive work, to AI for implementation-heavy work, and keeps the judgment-intensive work for themselves.

*How to develop:* For every task, ask: "Does this require my specific context, or just someone's execution?" Track your delegation decisions and review which ones you got right and wrong.

---
`;
}

/**
 * Helper to find balanced braces and replace component
 * Handles deeply nested JSX props like arrays of objects
 */
function replaceComponentWithBalancedBraces(content, componentName, replacementFn) {
  const tagPattern = new RegExp(`<${componentName}[\\s\\n]`, 'g');
  let result = content;
  let match;

  // Process all occurrences (work backwards to preserve indices)
  const matches = [];
  while ((match = tagPattern.exec(content)) !== null) {
    matches.push(match.index);
  }

  // Process in reverse order
  for (let i = matches.length - 1; i >= 0; i--) {
    const startIdx = matches[i];
    let braceCount = 0;
    let inBraces = false;
    let endIdx = -1;

    // Find the end of this component (/>)
    for (let j = startIdx; j < result.length - 1; j++) {
      const char = result[j];

      if (char === '{') {
        braceCount++;
        inBraces = true;
      } else if (char === '}') {
        braceCount--;
      }

      // Look for /> when braces are balanced
      if (!inBraces || braceCount === 0) {
        if (result[j] === '/' && result[j + 1] === '>') {
          endIdx = j + 2;
          break;
        }
      }
    }

    if (endIdx > startIdx) {
      const componentStr = result.slice(startIdx, endIdx);
      const replacement = replacementFn(componentStr);
      result = result.slice(0, startIdx) + replacement + result.slice(endIdx);
    }
  }

  return result;
}

/**
 * Main conversion function
 */
function convertToMedium(content, frontmatter) {
  let output = content;

  // Remove import statements
  output = output.replace(/^import\s+.*?from\s+['"].*?['"];?\s*$/gm, '');

  // Convert Callout components - flexible pattern to match all variations
  // This handles: <Callout type="x" title="y">, <Callout title="y" type="x">, etc.
  output = output.replace(
    /<Callout([^>]*)>([\s\S]*?)<\/Callout>/g,
    (match, attrs, content) => {
      // Extract type and title from attributes
      const typeMatch = attrs.match(/type=["'](\w+)["']/);
      const titleMatch = attrs.match(/title=["']([^"']+)["']/);
      const type = typeMatch ? typeMatch[1] : 'note';
      const title = titleMatch ? titleMatch[1] : null;
      return convertCallout(type, title, content);
    }
  );

  // Convert Citation components
  output = output.replace(
    /<Citation[\s\S]*?>([\s\S]*?)<\/Citation>/g,
    (match, content) => {
      const authorMatch = match.match(/author=["']([^"']+)["']/);
      const sourceMatch = match.match(/source=["']([^"']+)["']/);
      const urlMatch = match.match(/url=["']([^"']+)["']/);
      return convertCitation(
        content,
        authorMatch ? authorMatch[1] : null,
        sourceMatch ? sourceMatch[1] : null,
        urlMatch ? urlMatch[1] : null
      );
    }
  );

  // Convert complex components with nested props using balanced brace matching
  output = replaceComponentWithBalancedBraces(output, 'ThreePathsComparison', () => convertThreePathsComparison());
  output = replaceComponentWithBalancedBraces(output, 'ProfileComparison', () => convertProfileComparison());
  output = replaceComponentWithBalancedBraces(output, 'CareerFilter', () => convertCareerFilter());
  output = replaceComponentWithBalancedBraces(output, 'SkillsRadar', () => convertSkillsRadar());

  // Convert simple self-closing components
  output = output.replace(/<CareerPathEvolution\s*\/>/g, () => convertCareerPathEvolution());
  output = output.replace(/<LeverageFormula\s*\/>/g, () => convertLeverageFormula());

  // Handle any remaining self-closing custom components
  output = output.replace(
    /<([A-Z][a-zA-Z]+)\s*\/>/g,
    (match, tag) => `\n*[Interactive component: ${tag} - see original article]*\n`
  );

  // Handle any remaining custom components with content
  output = output.replace(
    /<([A-Z][a-zA-Z]+)[^>]*>([\s\S]*?)<\/\1>/g,
    (match, tag, content) => {
      // Keep the content, note the component
      return `\n*[${tag} component]*\n${content.trim()}\n`;
    }
  );

  // Convert internal links to umai-tech.com
  output = output.replace(
    /\[([^\]]+)\]\(\/blog\/([^)]+)\)/g,
    '[$1](https://www.umai-tech.com/blog/$2)'
  );

  // Convert internal links to umai-tech.com (any path)
  output = output.replace(
    /\[([^\]]+)\]\(\/([^)]+)\)/g,
    '[$1](https://www.umai-tech.com/$2)'
  );

  // Clean up multiple blank lines
  output = output.replace(/\n{4,}/g, '\n\n\n');

  // Clean up lines that are just whitespace
  output = output.replace(/^\s+$/gm, '');

  // Add title and metadata header for Medium
  const title = frontmatter.title || 'Untitled';
  const description = frontmatter.description || '';

  let header = `# ${title}\n\n`;
  if (description) {
    header += `*${description}*\n\n`;
  }
  header += `---\n\n`;

  // Process footnotes - convert to inline links where possible
  const footnoteRefs = output.match(/\[\^(\d+)\]/g) || [];
  const footnoteDefsRegex = /\[\^(\d+)\]:\s*(.+)/g;
  const footnoteDefs = {};

  let footnoteMatch;
  while ((footnoteMatch = footnoteDefsRegex.exec(output)) !== null) {
    footnoteDefs[footnoteMatch[1]] = footnoteMatch[2].trim();
  }

  // Remove footnote definitions from body
  output = output.replace(/^\[\^\d+\]:\s*.+$/gm, '');

  // Add footer with original link
  let footer = '\n\n---\n\n';
  footer += `*Originally published on [Umai Tech](https://www.umai-tech.com)*\n`;

  // Add footnotes section if any exist
  if (Object.keys(footnoteDefs).length > 0) {
    footer += '\n### References\n\n';
    for (const [num, def] of Object.entries(footnoteDefs)) {
      footer += `${num}. ${def}\n`;
    }
  }

  return header + output.trim() + footer;
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    console.log(`
${colors.bold}${colors.blue}Umai Tech Blog to Medium Converter${colors.reset}

${colors.yellow}Usage:${colors.reset}
  pnpm convert-to-medium <url-or-slug>

${colors.yellow}Examples:${colors.reset}
  pnpm convert-to-medium the-third-path-player-coach-at-scale
  pnpm convert-to-medium https://www.umai-tech.com/blog/the-third-path-player-coach-at-scale

${colors.yellow}Options:${colors.reset}
  --help, -h     Show this help message
  --list, -l     List all available blog posts
  --output, -o   Output to file instead of dist/ (e.g., -o ./my-post.md)

${colors.yellow}Output:${colors.reset}
  Converted markdown is saved to: dist/<slug>-medium.md
`);
    process.exit(0);
  }

  // Handle --list flag
  if (args[0] === '--list' || args[0] === '-l') {
    const blogDir = path.join(__dirname, '..', 'src', 'content', 'blog');
    const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.mdx') || f.endsWith('.md'));

    console.log(`\n${colors.bold}${colors.blue}Available Blog Posts:${colors.reset}\n`);
    for (const file of files) {
      const slug = file.replace(/\.(mdx?|md)$/, '');
      console.log(`  ${colors.cyan}${slug}${colors.reset}`);
    }
    console.log('');
    process.exit(0);
  }

  const input = args[0];
  const slug = extractSlug(input);

  console.log(`${colors.dim}Looking for blog post: ${slug}${colors.reset}`);

  const filePath = findBlogPost(slug);

  if (!filePath) {
    console.error(`${colors.red}Error: Blog post not found: ${slug}${colors.reset}`);
    console.log(`${colors.yellow}Tip: Run 'pnpm convert-to-medium --list' to see available posts${colors.reset}`);
    process.exit(1);
  }

  console.log(`${colors.green}✓ Found: ${path.basename(filePath)}${colors.reset}`);

  // Read the file
  const content = fs.readFileSync(filePath, 'utf-8');

  // Parse frontmatter and body
  const { frontmatter, body } = parseFrontmatter(content);

  // Convert to Medium format
  const mediumContent = convertToMedium(body, frontmatter);

  // Determine output path
  const outputIndex = args.findIndex(a => a === '--output' || a === '-o');
  let outputPath;

  if (outputIndex !== -1 && args[outputIndex + 1]) {
    outputPath = args[outputIndex + 1];
  } else {
    const distDir = path.join(__dirname, '..', 'dist');
    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir, { recursive: true });
    }
    outputPath = path.join(distDir, `${slug}-medium.md`);
  }

  // Write the output
  fs.writeFileSync(outputPath, mediumContent, 'utf-8');

  // Print stats
  const wordCount = mediumContent.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  console.log(`${colors.green}✓ Saved to: ${outputPath}${colors.reset}`);
  console.log(`\n${colors.dim}---${colors.reset}`);
  console.log(`${colors.cyan}Words: ${wordCount} | Reading time: ~${readingTime} min${colors.reset}`);

  console.log(`
${colors.yellow}Next Steps:${colors.reset}
  1. ${colors.dim}Review the converted markdown:${colors.reset} ${outputPath}
  2. ${colors.dim}Copy content and paste into Medium:${colors.reset} https://medium.com/new-story
  3. ${colors.dim}Or import directly from:${colors.reset} https://www.umai-tech.com/blog/${slug}
`);
}

main().catch(err => {
  console.error(`${colors.red}Error: ${err.message}${colors.reset}`);
  process.exit(1);
});
