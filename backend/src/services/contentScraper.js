/**
 * Content Scraper Service - Phase 2
 * Scrapes main content from article URLs using Puppeteer
 */

import puppeteer from 'puppeteer';

/**
 * Scrape main content from a URL
 * @param {string} url - URL to scrape
 * @returns {Promise<Object>} Scraped content with title and text
 */
export async function scrapeArticleContent(url) {
    let browser = null;

    try {
        console.log(`📄 Scraping content from: ${url}`);

        browser = await puppeteer.launch({
            headless: 'new',
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu'
            ]
        });

        const page = await browser.newPage();

        // Set viewport and user agent
        await page.setViewport({ width: 1920, height: 1080 });
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

        // Navigate to URL with timeout
        await page.goto(url, {
            waitUntil: 'networkidle2',
            timeout: 30000
        });

        // Wait for content to load
        await page.waitForTimeout(2000);

        // Extract content from page
        const content = await page.evaluate(() => {
            // Remove unwanted elements
            const selectorsToRemove = [
                'script',
                'style',
                'nav',
                'header',
                'footer',
                'aside',
                '.advertisement',
                '.ads',
                '.sidebar',
                '.comments',
                '.social-share',
                '[class*="cookie"]',
                '[class*="popup"]',
                '[class*="modal"]'
            ];

            selectorsToRemove.forEach(selector => {
                document.querySelectorAll(selector).forEach(el => el.remove());
            });

            // Try to find the main article title
            let title = '';
            const titleSelectors = ['h1', 'h1.title', '.article-title', '.post-title', 'article h1'];

            for (const selector of titleSelectors) {
                const titleEl = document.querySelector(selector);
                if (titleEl && titleEl.textContent.trim()) {
                    title = titleEl.textContent.trim();
                    break;
                }
            }

            // Fallback to page title
            if (!title) {
                title = document.title.split('|')[0].split('-')[0].trim();
            }

            // Try to find main content area
            const contentSelectors = [
                'article',
                'main',
                '.article-content',
                '.post-content',
                '.entry-content',
                '.content',
                '[class*="article"]',
                '[class*="post-content"]',
                '[role="main"]'
            ];

            let mainContent = null;
            for (const selector of contentSelectors) {
                const element = document.querySelector(selector);
                if (element) {
                    mainContent = element;
                    break;
                }
            }

            // Fallback to body if no main content found
            if (!mainContent) {
                mainContent = document.body;
            }

            // Extract paragraphs and headings
            const contentElements = mainContent.querySelectorAll('p, h2, h3, h4, li');

            const textContent = Array.from(contentElements)
                .map(el => el.textContent.trim())
                .filter(text => {
                    // Filter out short or irrelevant text
                    return text.length > 30 &&
                        !text.match(/^(Copyright|Terms|Privacy|Cookie)/i);
                })
                .join('\n\n');

            return {
                title,
                content: textContent,
                url: window.location.href
            };
        });

        await browser.close();

        if (!content.content || content.content.length < 100) {
            console.log('⚠️  Minimal content extracted, might need better selectors');
        }

        console.log(`✅ Scraped ${content.content.length} characters`);
        console.log(`   Title: ${content.title.substring(0, 60)}...`);

        return content;

    } catch (error) {
        console.error(`❌ Error scraping ${url}:`, error.message);

        if (browser) {
            await browser.close();
        }

        // Return minimal content on error
        return {
            title: 'Error loading article',
            content: `Failed to scrape content from ${url}: ${error.message}`,
            url,
            error: true
        };
    }
}

/**
 * Scrape multiple URLs concurrently
 * @param {Array<string>} urls - Array of URLs to scrape
 * @returns {Promise<Array>} Array of scraped content
 */
export async function scrapeMultipleArticles(urls) {
    console.log(`📚 Scraping ${urls.length} articles...`);

    const results = [];

    // Scrape sequentially to avoid overwhelming resources
    for (const url of urls) {
        try {
            const content = await scrapeArticleContent(url);
            results.push(content);

            // Small delay between requests
            await new Promise(resolve => setTimeout(resolve, 1000));

        } catch (error) {
            console.error(`Failed to scrape ${url}:`, error.message);
            results.push({
                title: 'Error',
                content: `Failed to scrape: ${error.message}`,
                url,
                error: true
            });
        }
    }

    console.log(`✅ Completed scraping ${results.length} articles`);
    return results;
}

/**
 * Clean and format scraped content
 * @param {string} content - Raw content
 * @returns {string} Cleaned content
 */
export function cleanContent(content) {
    if (!content) return '';

    return content
        .replace(/\s+/g, ' ') // Multiple spaces to single
        .replace(/\n\s*\n\s*\n/g, '\n\n') // Multiple newlines to double
        .trim();
}

export default {
    scrapeArticleContent,
    scrapeMultipleArticles,
    cleanContent
};
