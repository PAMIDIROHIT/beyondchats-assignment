/**
 * Google Search Service - Phase 2
 * Uses ScraperAPI to search Google for article titles and extract blog/article URLs
 */

import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const SCRAPER_API_KEY = process.env.SERP_API_KEY; // Using same env var name for compatibility
const SCRAPER_API_URL = 'https://api.scraperapi.com';

/**
 * Parse HTML to extract search results
 * @param {string} html - HTML content
 * @returns {Array} Array of search results
 */
function parseGoogleResults(html) {
    const results = [];

    // Simple regex-based extraction
    // Match anchor tags with href
    const linkRegex = /<a[^>]+href="(https?:\/\/[^"]+)"[^>]*>([^<]*(?:<[^a]*[^>]*>[^<]*)*)<\/a>/gi;
    const h3Regex = /<h3[^>]*>([^<]+)<\/h3>/gi;

    // Extract all URLs from the page
    const urlMatches = html.matchAll(/<a[^>]+href="(https?:\/\/(?!www\.google)[^"]+)"[^>]*>/gi);
    const h3Matches = [...html.matchAll(/<h3[^>]*>([^<]+)<\/h3>/gi)];

    let h3Index = 0;
    for (const match of urlMatches) {
        const url = match[1];

        // Skip Google, YouTube, and other unwanted domains
        const excludeDomains = [
            'google.com', 'google.co', 'gstatic.com', 'googleapis.com',
            'youtube.com', 'facebook.com', 'twitter.com', 'instagram.com',
            'pinterest.com', 'reddit.com', 'wikipedia.org'
        ];

        const isExcluded = excludeDomains.some(domain => url.includes(domain));
        if (isExcluded) continue;

        // Get title from nearby h3 if available
        const title = h3Matches[h3Index] ? h3Matches[h3Index][1] : extractTitleFromUrl(url);
        h3Index++;

        if (url && !results.some(r => r.url === url)) {
            results.push({
                url,
                title: title || extractTitleFromUrl(url),
                snippet: ''
            });
        }

        if (results.length >= 10) break;
    }

    return results;
}

/**
 * Extract a readable title from URL
 * @param {string} url - URL string
 * @returns {string} Title
 */
function extractTitleFromUrl(url) {
    try {
        const path = new URL(url).pathname;
        const segments = path.split('/').filter(s => s.length > 0);
        const lastSegment = segments[segments.length - 1] || '';
        return lastSegment
            .replace(/[-_]/g, ' ')
            .replace(/\.\w+$/, '')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ') || url;
    } catch {
        return url;
    }
}

/**
 * Search Google using ScraperAPI and get top blog/article URLs
 * @param {string} query - Article title to search
 * @param {number} numResults - Number of results to return (default: 2)
 * @returns {Promise<Array>} Array of URLs
 */
export async function searchGoogle(query, numResults = 2) {
    try {
        console.log(`🔍 Searching Google for: "${query}"`);

        if (!SCRAPER_API_KEY) {
            throw new Error('SCRAPER_API_KEY is not configured');
        }

        // Build Google search URL
        const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}&num=10`;

        // ScraperAPI request
        const response = await axios.get(SCRAPER_API_URL, {
            params: {
                api_key: SCRAPER_API_KEY,
                url: googleSearchUrl,
                render: false
            },
            timeout: 60000
        });

        if (!response.data) {
            console.log('⚠️  No response from ScraperAPI');
            return [];
        }

        // Parse HTML response
        const results = parseGoogleResults(response.data);

        console.log(`📊 Found ${results.length} search results`);

        // Filter and limit results
        const blogUrls = results.slice(0, numResults);

        console.log(`✅ Extracted ${blogUrls.length} blog/article URLs`);

        blogUrls.forEach((item, index) => {
            console.log(`  ${index + 1}. ${item.title}`);
            console.log(`     ${item.url}`);
        });

        return blogUrls;

    } catch (error) {
        console.error('❌ Google search error:', error.message);

        // Check for specific error types
        if (error.response) {
            console.error('API Response Error:', error.response.status, error.response.statusText);

            if (error.response.status === 401 || error.response.status === 403) {
                throw new Error('Invalid ScraperAPI key');
            } else if (error.response.status === 429) {
                throw new Error('ScraperAPI rate limit exceeded');
            }
        }

        throw error;
    }
}

/**
 * Search with retry logic for rate limits
 * @param {string} query - Search query
 * @param {number} numResults - Number of results
 * @param {number} maxRetries - Maximum retry attempts
 * @returns {Promise<Array>} Array of URLs
 */
export async function searchWithRetry(query, numResults = 2, maxRetries = 3) {
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await searchGoogle(query, numResults);
        } catch (error) {
            lastError = error;

            if (error.message.includes('rate limit') && attempt < maxRetries) {
                const waitTime = attempt * 2000; // Exponential backoff
                console.log(`⏳ Rate limited, waiting ${waitTime}ms before retry ${attempt}/${maxRetries}...`);
                await new Promise(resolve => setTimeout(resolve, waitTime));
            } else {
                break;
            }
        }
    }

    throw lastError;
}

export default { searchGoogle, searchWithRetry };
