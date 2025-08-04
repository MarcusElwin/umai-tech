// Vercel Function for page view tracking
// This runs as a serverless function on Vercel

// Simple in-memory storage (persists per function instance)
let viewsStore = new Map();

// Initialize with baseline counts from Vercel Analytics
const baselineCounts = new Map([
  ['agentic-commerce-the-dawn-of-a-new-ai-driven-era-for-ecommerce', 149],
  ['unpopular-opinion-hard-good-ds', 8],
  ['ner-dspy', 3],
]);

// Initialize views store with baseline counts
for (const [slug, count] of baselineCounts) {
  if (!viewsStore.has(slug)) {
    viewsStore.set(slug, count);
  }
}

// Rate limiting storage (per function instance)
let rateLimitStore = new Map();

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { slug } = req.query;

  if (!slug) {
    return res.status(400).json({ error: 'Slug is required' });
  }

  if (req.method === 'GET') {
    const views = viewsStore.get(slug) || 0;
    return res.status(200).json({ views });
  }

  if (req.method === 'POST') {
    // Basic rate limiting - check if same IP viewed recently
    const forwarded = req.headers['x-forwarded-for'];
    const ip = Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(',')[0] || 'unknown';
    const rateKey = `${slug}:${ip}`;
    
    const now = Date.now();
    const lastView = rateLimitStore.get(rateKey) || 0;
    
    // 15 minute rate limit
    if (now - lastView < 15 * 60 * 1000) {
      const currentViews = viewsStore.get(slug) || 0;
      return res.status(200).json({ 
        views: currentViews,
        rateLimited: true 
      });
    }

    // Increment view count
    const currentViews = viewsStore.get(slug) || 0;
    const newViews = currentViews + 1;
    viewsStore.set(slug, newViews);
    rateLimitStore.set(rateKey, now);

    return res.status(200).json({ 
      views: newViews,
      incremented: true 
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}