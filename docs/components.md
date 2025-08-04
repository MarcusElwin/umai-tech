# Component Documentation

This guide provides detailed documentation for all reusable components in the Umai Tech website.

## Core Components

### `AuthorCard.astro`

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

**Features:**
- Responsive design with avatar and social links
- Conditional bio display
- Date formatting
- Reading time indicator

---

### `Callout.astro`

Creates styled notification/alert boxes for content emphasis.

```astro
<Callout type="warning" title="Important Notice">
  This is a warning message.
</Callout>
```

**Props:**
- `type?: 'info' | 'warning' | 'error' | 'success' | 'note'` - Callout style (default: 'info')
- `title?: string` - Optional callout title

**Features:**
- Five distinct callout types with unique styling
- Optional title with icon indicators
- Dark mode support
- Accessible markup

---

### `TableOfContents.astro`

Collapsible table of contents with reading progress indicator.

```astro
<TableOfContents 
  headings={headings}
  title="Table of Contents"
/>
```

**Props:**
- `headings: Array<{slug: string, text: string, depth: number}>` - Page headings
- `title?: string` - TOC title (default: "Table of Contents")

**Features:**
- Collapsible with smooth animations
- Active section highlighting
- Reading progress bar
- Responsive design
- Keyboard accessible

---

### `RecentPosts.astro`

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

**Features:**
- Automatic content fetching
- Post filtering and sorting
- Responsive card layout
- Hover effects

---

### `PageViews.astro`

Displays and tracks page view counts for blog posts.

```astro
<PageViews slug="my-blog-post" />
```

**Props:**
- `slug: string` - Post slug for tracking
- `className?: string` - Additional CSS classes

**Features:**
- View count tracking
- Responsive display
- Icon and counter styling

---

### `Mermaid.astro`

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

**Features:**
- Dynamic diagram rendering
- Responsive scaling
- Dark mode support
- Error handling

---

### `PrettyList.astro`

Creates visually appealing lists with icons, titles, and descriptions for highlighting key information.

```astro
<PrettyList title="Key Features">
  <div class="pretty-list-item">
    <div class="pretty-list-icon">
      <svg fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    </div>
    <div class="pretty-list-content">
      <div class="pretty-list-title">Feature Title</div>
      <div class="pretty-list-description">
        Detailed description of the feature with **markdown** support.
      </div>
    </div>
  </div>
</PrettyList>
```

**Props:**
- `title?: string` - Optional list title with purple accent
- `type?: 'default' | 'numbered' | 'featured'` - List styling type (default: 'default')

**Features:**
- Gradient background container with rounded corners
- Individual list items with hover effects
- SVG icon support with circular backgrounds
- Dark mode support
- Responsive design
- Markdown support in descriptions

**CSS Classes:**
- `.pretty-list-item` - Individual list item container
- `.pretty-list-icon` - Icon container with gradient background
- `.pretty-list-content` - Content wrapper
- `.pretty-list-title` - Item title styling
- `.pretty-list-description` - Item description styling

---

### `PrettyTable.astro`

Creates professional, responsive tables with enhanced styling for displaying structured data like terminology, comparisons, or reference materials.

```astro
<PrettyTable 
  title="Key Terminology" 
  headers={["Term", "Definition", "Sources"]}
  showIcons={true}
  enableCopy={true}
>
  <tr class="pretty-table-row">
    <td class="pretty-table-cell">
      <div class="pretty-table-term-with-icon">
        <svg class="pretty-table-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
        </svg>
        <div class="pretty-table-term">Term Name</div>
      </div>
    </td>
    <td class="pretty-table-cell">
      <div class="pretty-table-definition">Clear definition with **markdown** support</div>
    </td>
    <td class="pretty-table-cell">
      <div class="pretty-table-sources">
        <div><a href="https://example.com" target="_blank">Source Link</a></div>
      </div>
    </td>
  </tr>
</PrettyTable>
```

**Props:**
- `title?: string` - Optional table title with purple accent
- `headers: string[]` - Array of column header names
- `responsive?: boolean` - Enable horizontal scrolling on mobile (default: true)
- `showIcons?: boolean` - Enable icon display for terms (default: true)
- `enableCopy?: boolean` - Show copy-to-markdown button (default: true)

**Features:**
- Gradient background with professional styling
- Responsive design with horizontal scroll on mobile
- Hover effects on table rows
- Dark mode support
- Purple accent theming consistent with site design
- Structured CSS classes for content organization
- **Copy to Markdown**: One-click export of table data as properly formatted markdown
- Smart link extraction preserving URLs in markdown format
- Visual feedback with success/error states

**CSS Classes:**
- `.pretty-table-row` - Table row with hover effects
- `.pretty-table-cell` - Standard cell styling with proper spacing
- `.pretty-table-term` - Bold styling for key terms/names
- `.pretty-table-term-with-icon` - Flexbox container for icon + term
- `.pretty-table-icon` - SVG icon styling with purple theming
- `.pretty-table-definition` - Regular text for definitions/descriptions
- `.pretty-table-sources` - Smaller text with link styling for references

---

### `Citation.astro`

Creates styled citation/quote blocks for academic references and quotations in blog content.

```astro
<Citation 
  type="quote" 
  author="Jeff Bezos" 
  source="Amazon Annual Shareholder Meeting" 
  date="2001"
>
I predict that because of artificial intelligence and its ability to automate certain tasks that in the past have required human intuition, by far the greatest breakthroughs will come by bringing human and artificial intelligence together.
</Citation>

<Citation 
  type="pullquote"
  author="Reid Hoffman"
  source="Masters of Scale Podcast"
  url="https://mastersofscale.com/"
  date="2024"
>
The future of commerce isn't about replacing human decision-making—it's about amplifying human intelligence with AI agents that can act on our behalf at the speed of business.
</Citation>

<Citation type="reference" source="McKinsey Global Institute Report on AI in Retail">
Companies implementing AI-driven commerce solutions report 40% higher customer satisfaction rates and 25% improvement in operational efficiency within the first year.
</Citation>
```

**Props:**
- `type?: 'quote' | 'reference' | 'pullquote'` - Citation style (default: 'quote')
- `author?: string` - Quote author or researcher name
- `source?: string` - Publication or source name
- `url?: string` - Link to original source (makes source clickable)
- `date?: string` - Publication or quote date

**Features:**
- Three distinct citation types with unique styling
- Optional clickable source links
- Proper academic citation formatting
- Dark mode support with accent colors
- Hover effects and smooth transitions
- Accessible markup with proper semantic elements

---

### `ReadingTime.astro`

Calculates and displays estimated reading time for content.

```astro
<ReadingTime content={blogPostContent} />
```

**Props:**
- `content: string` - Content to analyze
- `className?: string` - Additional CSS classes

**Features:**
- Word count analysis
- Average reading speed calculation
- Responsive display

## Layout Components

### `Header.astro`

Fixed navigation header with animated logo and responsive menu.

**Features:**
- Animated logo with alternating icons
- Responsive navigation menu
- Mobile hamburger menu
- Sticky positioning
- Dark mode support

---

### `Footer.astro`

Site-wide footer with navigation links and brand information.

**Features:**
- Navigation links
- Social media links
- Brand information
- Responsive design

---

### `Hero.astro`

Main landing page hero section with Japanese-inspired design.

**Features:**
- Animated background patterns
- Call-to-action buttons
- Responsive typography
- Japanese aesthetic elements

---

### `Features.astro`

Displays company expertise/services in a responsive grid layout with consistent SVG icons.

**Features:**
- Responsive grid layout
- Consistent SVG icons
- Hover animations
- Service descriptions

---

### `InteractiveCV.astro`

Dynamic, interactive resume component with print functionality and JSON-like display.

**Features:**
- Interactive sections with hover effects
- Print-optimized layout
- JSON-style data visualization
- Responsive typography
- Expandable sections

## Card Components

### `ProductCard.astro`

Displays product information with status indicators and features.

```astro
<ProductCard 
  title="Product Name"
  description="Product description"
  status="live"
  tags={["AI", "ML"]}
  features={["Feature 1", "Feature 2"]}
  url="https://product.com"
/>
```

**Props:**
- `title: string` - Product title
- `description: string` - Product description
- `status: 'live' | 'in-progress' | 'beta'` - Product status
- `tags?: string[]` - Technology tags
- `features?: string[]` - Product features
- `url?: string` - Product URL

---

### `ProjectCard.astro`

Displays project information with GitHub integration.

```astro
<ProjectCard 
  title="Project Name"
  description="Project description"
  icon="lightning"
  tags={["Python", "AI"]}
  githubUrl="https://github.com/user/repo"
  status="active"
/>
```

**Props:**
- `title: string` - Project title
- `description: string` - Project description
- `icon: string` - Icon identifier
- `tags: string[]` - Technology tags
- `githubUrl: string` - GitHub repository URL
- `demoUrl?: string` - Demo URL
- `status?: 'active' | 'archived' | 'wip'` - Project status

---

### `ServiceCard.astro`

Displays service information with features and pricing.

```astro
<ServiceCard 
  title="Service Name"
  description="Service description"
  icon="consulting"
  features={["Feature 1", "Feature 2"]}
  pricing="Custom pricing"
  cta={{text: "Get Started", href: "/contact"}}
/>
```

**Props:**
- `title: string` - Service title
- `description: string` - Service description
- `icon: string` - Icon identifier
- `features: string[]` - Service features
- `pricing?: string` - Pricing information
- `cta?: {text: string, href: string}` - Call-to-action button

## Layout Template

### `Layout.astro`

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

**Features:**
- SEO meta tags
- Font loading optimization
- Dark mode support
- Vercel Analytics integration
- Responsive viewport settings

## Design System

### Icons

All components use consistent SVG icons from a shared icon system:

- `lightning` - GenAI/AI solutions
- `brain` - Machine learning
- `database` - Data engineering
- `consulting` - Strategy consulting
- `rocket` - Startup advisory
- `code` - Development projects
- `legal` - Legal tech projects

### Color Palette

```css
/* Primary Colors */
--umai-primary: #0a0a0a
--umai-secondary: #f5f5f5
--umai-accent: #8B5CF6

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

- **Primary**: Inter (sans-serif)
- **Monospace**: JetBrains Mono
- **Japanese**: Noto Sans JP

### Card Patterns

All cards follow consistent patterns:

- **Border Radius**: `rounded-2xl` for large cards, `rounded-xl` for small
- **Padding**: `p-8` for large cards, `p-6` for medium, `p-4` for small
- **Borders**: `border-umai-gray-200 dark:border-umai-gray-700`
- **Hover Effects**: `hover:border-umai-accent/50`
- **Transitions**: `transition-all duration-300`

This ensures visual consistency across all components while maintaining flexibility for specific use cases.

## Blog-Specific Components

### `InvestmentDashboard.astro`

Interactive dashboard displaying agentic commerce investment landscape data including funding rounds, market statistics, and geographic distribution.

```astro
<InvestmentDashboard 
  totalInvestment="$8.6B"
  quarterlyData="Q3 2024"
  fundingRounds={[
    {
      id: "company-1",
      company: "Example Corp",
      amount: "$50M",
      valuation: "$200M",
      stage: "Series A",
      description: "AI commerce platform",
      category: "platforms",
      date: "2025"
    }
  ]}
  marketStats={{
    companiesTracked: "600+",
    categories: "30",
    revenueMultiple: "2-3x",
    geographicSplit: [
      { region: "United States", percentage: 70, focus: "AI platforms" }
    ]
  }}
/>
```

**Props:**
- `totalInvestment?: string` - Total investment amount (default: "$8.6B")
- `quarterlyData?: string` - Quarter/period for data (default: "Q3 2024")
- `fundingRounds: Array<FundingRound>` - Array of funding round data
- `marketStats?: MarketStats` - Optional market statistics object

**Types:**
```typescript
interface FundingRound {
  id: string;
  company: string;
  amount: string;
  valuation?: string;
  stage: string;
  description: string;
  category: 'platforms' | 'checkout' | 'infrastructure' | 'specialized';
  date?: string;
}

interface MarketStats {
  companiesTracked: string;
  categories: string;
  revenueMultiple: string;
  geographicSplit: Array<{
    region: string;
    percentage: number;
    focus: string;
  }>;
}
```

**Features:**
- Key metrics cards with gradient backgrounds
- Interactive funding rounds table with category color coding
- Geographic investment distribution with progress bars
- Responsive design with hover effects
- Category filtering and sorting capabilities

---

### `UpdateTracker.astro`

Timeline-based component for tracking and displaying post updates, changes, and version history with categorized update types and impact levels.

```astro
<UpdateTracker 
  updates={[
    {
      id: "v2.1",
      date: "August 4, 2025",
      version: "2.1",
      type: "major",
      title: "Major Enhancement",
      description: "Comprehensive update with new sections and data",
      impact: "high",
      changes: [
        {
          action: "added",
          item: "New Investment section",
          detail: "Comprehensive funding analysis with $8.6B data"
        },
        {
          action: "updated",
          item: "Market projections",
          detail: "Enhanced with $4.4T US market sizing"
        }
      ]
    }
  ]}
  showVersions={true}
  showImpact={true}
  maxVisible={5}
/>
```

**Props:**
- `updates: Array<Update>` - Array of update objects (required)
- `showVersions?: boolean` - Display version numbers (default: true)
- `showImpact?: boolean` - Show impact level badges (default: true) 
- `maxVisible?: number` - Limit visible updates with "show more" option
- `defaultCollapsed?: boolean` - Start in collapsed state (default: true)
- `collapsedHeight?: string` - Height when collapsed (default: "120px")

**Types:**
```typescript
interface Update {
  id: string;
  date: string;
  version?: string;
  type: 'major' | 'minor' | 'data' | 'content';
  title: string;
  description: string;
  changes: Array<{
    action: 'added' | 'updated' | 'enhanced' | 'fixed';
    item: string;
    detail?: string;
  }>;
  impact?: 'high' | 'medium' | 'low';
}
```

**Features:**
- **Collapsible interface** with toggle button and smooth animations
- Timeline-based layout with connecting lines
- Color-coded update types (major=purple, minor=blue, data=green, content=amber)
- Impact level badges (high=red, medium=yellow, low=gray)
- Detailed change lists with action icons
- Responsive design with proper dark mode support
- Type legend for easy understanding
- Accessibility features (ARIA labels, keyboard navigation)
- JavaScript-free fallback (gracefully degrades)

**Update Types:**
- **Major**: Significant new sections or comprehensive analysis additions
- **Minor**: Content improvements, clarifications, or structural changes
- **Data**: Updated statistics, market figures, or research findings
- **Content**: Editorial improvements, typo fixes, or formatting updates

---

### `CapabilityCard.astro`

Displays agent capabilities in a numbered grid format with icons and detailed descriptions.

```astro
<CapabilityCard 
  capabilities={[
    {
      number: 1,
      title: "Autonomous Decision Making",
      description: "AI agents can evaluate options and make purchasing decisions independently",
      example: "Automatically selecting the best supplier based on price, quality, and delivery time",
      footnote: "Requires pre-defined decision criteria and budget limits",
      icon: "autonomy"
    },
    {
      number: 2,
      title: "Multi-step Planning",
      description: "Complex task decomposition and execution planning",
      icon: "planning"
    }
  ]}
/>
```

**Props:**
- `capabilities: Array<{number, title, description, example?, footnote?, icon?}>` - List of capabilities to display

**Features:**
- Responsive 2-column grid layout
- Numbered capability cards with hover effects
- Built-in SVG icons (autonomy, planning, memory, integration)
- Gradient hover animations
- Support for examples and footnotes

---

### `MaturityLevels.astro`

Interactive maturity assessment component with level indicators and descriptions.

```astro
<MaturityLevels 
  title="AI Agent Maturity Assessment"
  levels={[
    {
      level: 1,
      name: "Basic Automation",
      description: "Simple rule-based responses",
      color: "#EF4444",
      percentage: 20
    },
    {
      level: 5,
      name: "Full Autonomy",
      description: "Independent decision-making and learning",
      color: "#10B981",
      percentage: 95
    }
  ]}
/>
```

**Props:**
- `title?: string` - Component title
- `levels: Array<{level, name, description, color, percentage}>` - Maturity levels with visual indicators

**Features:**
- Interactive level bars with color coding
- Percentage-based visual progress
- Hover effects with detailed descriptions
- Responsive design with mobile optimization

---

### `ConvergenceForces.astro`

Displays the three forces driving agentic commerce with interconnected visual design.

```astro
<ConvergenceForces 
  forces={[
    {
      id: "ai-agents",
      title: "Advanced AI Agents",
      description: "LLMs with reasoning, memory, and tool use",
      icon: "brain",
      examples: ["GPT-4", "Claude", "Gemini"]
    },
    {
      id: "payment-infrastructure", 
      title: "Payment Infrastructure",
      description: "Agent-ready APIs and autonomous transaction systems",
      icon: "payment",
      examples: ["Visa Intelligent Commerce", "Mastercard Agent Pay"]
    },
    {
      id: "commerce-platforms",
      title: "Commerce Platforms", 
      description: "E-commerce systems with agent-optimized interfaces",
      icon: "commerce",
      examples: ["Shopify Magic", "Amazon Agent APIs"]
    }
  ]}
/>
```

**Props:**
- `forces: Array<{id, title, description, icon, examples}>` - The three convergence forces
- `centerTitle?: string` - Central convergence point title

**Features:**
- Triangular force diagram with center convergence
- Animated connections between forces
- Interactive hover states
- Example listings for each force
- Responsive scaling

---

### `Timeline.astro`

Vertical timeline component for displaying chronological events and milestones.

```astro
<Timeline 
  title="Agentic Commerce Timeline"
  events={[
    {
      date: "2024 Q1",
      title: "Infrastructure Foundation",
      description: "Payment systems and APIs launch",
      type: "milestone",
      status: "completed"
    },
    {
      date: "2025 Q2", 
      title: "Consumer Adoption",
      description: "First mainstream agent shopping experiences",
      type: "prediction",
      status: "upcoming"
    }
  ]}
/>
```

**Props:**
- `title?: string` - Timeline title
- `events: Array<{date, title, description, type?, status?}>` - Timeline events
- `orientation?: 'vertical' | 'horizontal'` - Timeline layout (default: vertical)

**Features:**
- Responsive vertical/horizontal layouts
- Status indicators (completed, in-progress, upcoming)
- Event type styling (milestone, prediction, achievement)
- Smooth scroll animations
- Connected line visualization

---

### `CompetitiveLandscape.astro`

Interactive bubble chart showing companies in the agentic commerce ecosystem.

```astro
<CompetitiveLandscape 
  title="Agentic Commerce Ecosystem"
  companies={[
    {
      id: "openai",
      name: "OpenAI",
      category: "ai-platforms",
      maturity: 8.5,
      scope: 9.2,
      size: 45,
      description: "ChatGPT with autonomous agent capabilities",
      keyMetrics: ["$10B ARR", "500M users"],
      status: "production"
    }
  ]}
  categories={[
    {
      id: "ai-platforms",
      name: "AI Platforms", 
      color: "#8B5CF6",
      description: "Core AI and agent platforms"
    }
  ]}
/>
```

**Props:**
- `title?: string` - Chart title
- `companies: Array<{id, name, category, maturity, scope, size, description, keyMetrics, status}>` - Company data
- `categories: Array<{id, name, color, description}>` - Category definitions
- `interactive?: boolean` - Enable hover interactions (default: true)

**Features:**
- Interactive bubble positioning based on maturity/scope
- Category-based color coding
- Company size represented by bubble diameter
- Detailed hover cards with metrics
- Responsive scaling and mobile optimization
- Legend with category explanations

---

### `FuturePredictions.astro`

Interactive timeline showing future phases of agentic commerce evolution.

```astro
<FuturePredictions 
  phases={[
    {
      id: "foundation-phase",
      timeframe: "2025-2026",
      title: "The Foundation Phase",
      subtitle: "Infrastructure becomes ubiquitous",
      marketValue: "$136B",
      adoptionRate: "15%",
      color: "#8B5CF6",
      keyInsights: [
        {
          title: "Payment Infrastructure Goes Live",
          description: "Global rollout of agent-ready payment systems",
          icon: "infrastructure"
        }
      ],
      metrics: [
        { label: "AI-Influenced Transactions", value: "15%", trend: "up" }
      ]
    }
  ]}
/>
```

**Props:**
- `phases: Array<{id, timeframe, title, subtitle, marketValue, adoptionRate, color, keyInsights, metrics}>` - Future phases
- `interactive?: boolean` - Enable phase selection (default: true)

**Features:**
- Interactive phase selection with smooth transitions
- Market value and adoption rate visualizations
- Detailed insights with icons and descriptions
- Metric cards with trend indicators
- Progress bar showing timeline progression
- Mobile-optimized accordion layout

---

### `ChallengeCategories.astro`

Comprehensive challenge breakdown with impact analysis and solutions.

```astro
<ChallengeCategories 
  challenges={[
    {
      id: "trust-gap",
      title: "Consumer Trust Deficit",
      subtitle: "64% won't trust AI with shopping",
      severity: "high",
      icon: "trust",
      keyPoints: [
        "64% of US adults unwilling to trust AI assistants",
        "Fear of unauthorized purchases"
      ],
      impact: "Fundamental adoption barrier preventing market scale",
      solution: "Start with low-risk purchases to build confidence"
    }
  ]}
/>
```

**Props:**
- `challenges: Array<{id, title, subtitle, severity, icon, keyPoints, impact, solution}>` - Challenge definitions
- `expandable?: boolean` - Allow expanding for details (default: true)

**Features:**
- Severity-based color coding (high, medium, low)
- Expandable cards with detailed breakdowns
- Icon system for challenge categories
- Impact and solution sections
- Responsive grid layout
- Smooth expand/collapse animations

---

### `ResearchInsights.astro`

Research validation component with data sources and methodology.

```astro
<ResearchInsights 
  title="Market Validation"
  insights={[
    {
      finding: "Enterprise adoption leads consumer by 3-5 years",
      confidence: "high",
      sources: ["McKinsey Global Institute", "Forrester Research"],
      methodology: "Survey of 1,200 enterprise decision makers",
      implications: ["B2B market develops first", "Consumer trust follows proven B2B success"]
    }
  ]}
  methodology={{
    sampleSize: "1,200+ enterprises, 2,400+ consumers",
    timeframe: "Q3 2024 - Q1 2025",
    geography: "US, EU, Asia-Pacific",
    confidence: "95%"
  }}
/>
```

**Props:**
- `title?: string` - Research section title
- `insights: Array<{finding, confidence, sources, methodology, implications}>` - Research findings
- `methodology?: {sampleSize, timeframe, geography, confidence}` - Research methodology details

**Features:**
- Confidence level indicators with visual scales
- Source attribution and linking
- Methodology transparency section
- Implication analysis with bullet points
- Academic citation formatting
- Expandable methodology details