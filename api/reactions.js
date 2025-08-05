// Vercel Function for post reactions using Vercel KV (Redis)
import { kv } from '@vercel/kv';

// Available reaction types
const REACTIONS = {
  'like': '👍',
  'love': '❤️',
  'rocket': '🚀',
  'fire': '🔥',
  'mind_blown': '🤯'
};

async function getReactions(slug) {
  try {
    const reactions = {};
    
    // Get all reaction counts for this post
    for (const [type, emoji] of Object.entries(REACTIONS)) {
      const count = await kv.get(`reactions:${slug}:${type}`) || 0;
      reactions[type] = {
        emoji,
        count: parseInt(count, 10)
      };
    }
    
    return reactions;
  } catch (error) {
    console.error('Error getting reactions from KV:', error);
    // Return empty reactions on error
    const reactions = {};
    for (const [type, emoji] of Object.entries(REACTIONS)) {
      reactions[type] = { emoji, count: 0 };
    }
    return reactions;
  }
}

async function addReaction(slug, reactionType) {
  try {
    if (!REACTIONS[reactionType]) {
      throw new Error('Invalid reaction type');
    }
    
    // Use atomic increment to avoid race conditions
    const newCount = await kv.incr(`reactions:${slug}:${reactionType}`);
    return newCount;
  } catch (error) {
    console.error('Error adding reaction to KV:', error);
    // Fallback: get current + 1
    const current = await kv.get(`reactions:${slug}:${reactionType}`) || 0;
    const newCount = parseInt(current, 10) + 1;
    await kv.set(`reactions:${slug}:${reactionType}`, newCount);
    return newCount;
  }
}

async function checkReactionRateLimit(slug, reactionType, ip) {
  try {
    const rateKey = `reaction_rate:${slug}:${reactionType}:${ip}`;
    const lastReaction = await kv.get(rateKey);
    const now = Date.now();
    
    // 5 minute rate limit per reaction type per post per IP
    if (lastReaction && now - parseInt(lastReaction, 10) < 5 * 60 * 1000) {
      return true; // Rate limited
    }
    
    // Update rate limit
    await kv.setex(rateKey, 300, now.toString()); // 5 minutes TTL
    return false; // Not rate limited
  } catch (error) {
    console.error('Error checking reaction rate limit:', error);
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
      const reactions = await getReactions(slug);
      
      // Prevent caching for dynamic reaction counts
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      
      return res.status(200).json({ reactions });
    } catch (error) {
      console.error('GET reactions error:', error);
      return res.status(500).json({ error: 'Failed to get reactions' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { reactionType } = req.body || {};
      
      if (!reactionType || !REACTIONS[reactionType]) {
        return res.status(400).json({ error: 'Valid reactionType is required' });
      }

      // Get IP for rate limiting
      const forwarded = req.headers['x-forwarded-for'];
      const ip = Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(',')[0] || 'unknown';
      
      // Check rate limit
      const isRateLimited = await checkReactionRateLimit(slug, reactionType, ip);
      
      if (isRateLimited) {
        const reactions = await getReactions(slug);
        return res.status(200).json({ 
          reactions,
          rateLimited: true,
          message: 'Please wait before reacting again'
        });
      }

      // Add reaction
      const newCount = await addReaction(slug, reactionType);
      const reactions = await getReactions(slug);

      return res.status(200).json({ 
        reactions,
        added: reactionType,
        newCount
      });
    } catch (error) {
      console.error('POST reactions error:', error);
      return res.status(500).json({ error: 'Failed to add reaction' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}