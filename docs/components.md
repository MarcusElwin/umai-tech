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