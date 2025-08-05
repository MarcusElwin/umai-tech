// Vercel Function for page view tracking using Vercel KV (Redis)
import { kv } from '@vercel/kv';

// Baseline counts from Vercel Analytics (latest data)
const baselineCounts = {
  'agentic-commerce-the-dawn-of-a-new-ai-driven-era-for-ecommerce': 157,
  'unpopular-opinion-hard-good-ds': 4,
  'prompt-eng-ner': 2,
};

async function getViews(slug) {
  try {
    // Try to get from KV store
    const views = await kv.get(`views:${slug}`);
    if (views !== null) {
      return parseInt(views, 10);
    }
    
    // If not in KV, check if we have a baseline count
    if (baselineCounts[slug]) {
      // Initialize KV with baseline count
      await kv.set(`views:${slug}`, baselineCounts[slug]);
      return baselineCounts[slug];
    }
    
    // Default to 0 for new posts
    await kv.set(`views:${slug}`, 0);
    return 0;
  } catch (error) {
    console.error('Error getting views from KV:', error);
    // Fallback to baseline or 0
    return baselineCounts[slug] || 0;
  }
}

async function incrementViews(slug) {
  try {
    // Use atomic increment to avoid race conditions
    const newViews = await kv.incr(`views:${slug}`);
    return newViews;
  } catch (error) {
    console.error('Error incrementing views in KV:', error);
    // Fallback: get current + 1
    const current = await getViews(slug);
    const newViews = current + 1;
    await kv.set(`views:${slug}`, newViews);
    return newViews;
  }
}

async function checkRateLimit(slug, ip) {
  try {
    const rateKey = `rate:${slug}:${ip}`;
    const lastView = await kv.get(rateKey);
    const now = Date.now();
    
    if (lastView && now - parseInt(lastView, 10) < 15 * 60 * 1000) {
      return true; // Rate limited
    }
    
    // Update rate limit
    await kv.setex(rateKey, 900, now.toString()); // 15 minutes TTL
    return false; // Not rate limited
  } catch (error) {
    console.error('Error checking rate limit:', error);
    return false; // Allow on error
  }
}

export default async function handler(req, res) {
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
    try {
      const views = await getViews(slug);
      return res.status(200).json({ views });
    } catch (error) {
      console.error('GET error:', error);
      return res.status(500).json({ error: 'Failed to get views' });
    }
  }

  if (req.method === 'POST') {
    try {
      // Get IP for rate limiting
      const forwarded = req.headers['x-forwarded-for'];
      const ip = Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(',')[0] || 'unknown';
      
      // Check rate limit
      const isRateLimited = await checkRateLimit(slug, ip);
      
      if (isRateLimited) {
        const currentViews = await getViews(slug);
        return res.status(200).json({ 
          views: currentViews,
          rateLimited: true 
        });
      }

      // Increment view count
      const newViews = await incrementViews(slug);

      return res.status(200).json({ 
        views: newViews,
        incremented: true 
      });
    } catch (error) {
      console.error('POST error:', error);
      return res.status(500).json({ error: 'Failed to increment views' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}