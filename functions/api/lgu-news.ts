/**
 * LGU News API
 * GET /api/lgu-news - Recent announcements from the City of Taguig
 *
 * Reads the 3 most recent published items from the city's kiosk news API.
 * Uses KV caching with 15-minute TTL and rate limiting (30 requests/minute).
 */
import { createKVCache, CACHE_TTL } from '../utils/kv-cache';
import { cachedJson } from '../utils/cache';
import {
  checkRateLimit,
  getClientIdentifier,
  addRateLimitHeaders,
  createRateLimitResponse,
} from '../utils/rate-limit';
import type { Env } from '../types';

/**
 * LGU News Post structure
 */
interface LGUNewsPost {
  title: string;
  url: string;
  date: string;
  excerpt: string;
  imageUrl: string;
}

/**
 * API Response shape
 */
interface LGUNewsResponse {
  posts: LGUNewsPost[];
  source: string;
  cached: boolean;
}

const NEWS_API = 'https://kiosk-info.taguig.gov.ph/api/news';
const NEWS_UPLOADS = 'https://kiosk-info.taguig.gov.ph/uploads/news/';
const SOURCE = 'kiosk-info.taguig.gov.ph';

interface KioskNewsItem {
  id: number;
  title: string;
  content: string | null;
  published_date: string | null;
  status: string;
  deleted_at: string | null;
  attachment: string | null;
}

/**
 * Fetch the City of Taguig's published announcements from its kiosk API
 */
async function fetchAndParse(): Promise<LGUNewsResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch(NEWS_API, {
      signal: controller.signal,
      headers: { 'User-Agent': 'BetterTaguig/1.0 (+https://bettertaguig.org)' },
    });
    if (!response.ok) {
      throw new Error(`News API returned ${response.status}`);
    }
    const body = (await response.json()) as { data?: KioskNewsItem[] };

    const posts: LGUNewsPost[] = (body.data ?? [])
      .filter(item => item.status === 'Published' && !item.deleted_at)
      .sort((a, b) =>
        (b.published_date ?? '').localeCompare(a.published_date ?? '')
      )
      .slice(0, 3)
      .map(item => ({
        title: item.title,
        url: item.attachment
          ? NEWS_UPLOADS + encodeURIComponent(item.attachment)
          : 'https://www.taguig.gov.ph/',
        date: item.published_date ?? '',
        excerpt: item.content ?? '',
        imageUrl: '',
      }));

    return { posts, source: SOURCE, cached: false };
  } catch (error) {
    console.error('Error fetching LGU news:', error);
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * GET /api/lgu-news
 * Returns the 3 most recent announcements from the City of Taguig
 */
export async function onRequestGet(context: {
  request: Request;
  env: Env;
}): Promise<Response> {
  const { request, env } = context;

  try {
    // Rate limit check: 30 requests per minute
    const rateLimitResult = await checkRateLimit(
      env.WEATHER_KV,
      'lgu-news:' + getClientIdentifier(request),
      { limit: 30, window: 60 }
    );

    if (!rateLimitResult.allowed) {
      return createRateLimitResponse(rateLimitResult, 30);
    }

    // Use KV cache with 15-minute TTL
    const kvCache = createKVCache(env);
    const result = await kvCache.get<LGUNewsResponse>(
      'lgu-news:homepage',
      async () => {
        const data = await fetchAndParse();
        return data;
      },
      CACHE_TTL.list
    );

    // Mark as cached when coming from KV
    const response = cachedJson(
      {
        ...result,
        cached: true,
      },
      'list'
    );

    // Add rate limit headers
    return addRateLimitHeaders(response, rateLimitResult, 30);
  } catch (error) {
    console.error('LGU news API error:', error);
    return cachedJson(
      { error: 'Failed to fetch news', posts: [] },
      'none',
      502
    );
  }
}
