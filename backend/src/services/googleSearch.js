/**
 * Google Search Service - Phase 2
 * Uses SerpAPI to search article titles and extract blog/article URLs
 */

import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const SERP_API_KEY = process.env.SERP_API_KEY;
const SERP_API_URL = 'https://serpapi.com/search';

/**
 * Search Google for article title and get top blog/article URLs
 * @param {string} query - Article title to search
 * @param {number} numResults - Number of results to return (default: 2)
 * @returns {Promise<Array>} Array of URLs
 */
export async function searchGoogle(query, numResults = 2) {
    try {
        console.log(`🔍 Searching Google for: "${query}"`);

        if (!SERP_API_KEY) {
            throw new Error('SERP_API_KEY is not configured');
        }

        // SerpAPI request parameters
        const params = {
            api_key: SERP_API_KEY,
            q: query,
            engine: 'google',
            num: 10, // Get more results to filter from
            hl: 'en',
            gl: 'us'
        };

        const response = await axios.get(SERP_API_URL, { params });

        if (!response.data || !response.data.organic_results) {
            console.log('⚠️  No organic results found');
            return [];
        }

        const organicResults = response.data.organic_results;
        console.log(`📊 Found ${organicResults.length} organic results`);

        // Filter for blog/article URLs
        const blogUrls = organicResults
            .filter(result => {
                const url = result.link || '';
                const title = (result.title || '').toLowerCase();
                const snippet = (result.snippet || '').toLowerCase();

                // Exclude certain domains
                const excludeDomains = [
                    'youtube.com',
                    'facebook.com',
                    'twitter.com',
                    'instagram.com',
                    'linkedin.com',
                    'pinterest.com',
                    'reddit.com',
                    'quora.com',
                    'stackoverflow.com',
                    'github.com',
                    'wikipedia.org'
                ];

                const isExcluded = excludeDomains.some(domain => url.includes(domain));
                if (isExcluded) return false;

                // Prefer URLs that look like blog/article pages
                const blogIndicators = [
                    '/blog/',
                    '/article/',
                    '/post/',
                    '/news/',
                    '/guide/',
                    '/tutorial/',
                    'blog',
                    'article'
                ];

                const hasBlogIndicator = blogIndicators.some(indicator =>
                    url.includes(indicator) || title.includes(indicator) || snippet.includes(indicator)
                );

                return hasBlogIndicator || true; // Include all if no strong indicators
            })
            .slice(0, numResults)
            .map(result => ({
                title: result.title,
                url: result.link,
                snippet: result.snippet
            }));

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
            console.error('API Response Error:', error.response.data);

            if (error.response.status === 401) {
                throw new Error('Invalid SerpAPI key');
            } else if (error.response.status === 429) {
                throw new Error('SerpAPI rate limit exceeded');
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
