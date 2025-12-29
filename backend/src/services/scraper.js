/**
 * BeyondChats Blog Scraper - Phase 1
 * Scrapes the 5 oldest articles from the last page of BeyondChats blogs
 */

import puppeteer from 'puppeteer';
import dotenv from 'dotenv';
import { connectDB } from '../config/database.js';
import Article from '../models/Article.js';

dotenv.config();

/**
 * Scrape articles from BeyondChats blog
 * @returns {Promise<Array>} Array of scraped articles
 */
async function scrapeBeyondChatsBlogs() {
    let browser = null;

    try {
        console.log('🚀 Starting BeyondChats blog scraper...');
        console.log('🌐 Target URL: https://beyondchats.com/blogs/');

        // Launch browser with specific settings
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

        console.log('📄 Navigating to blogs page...');
        await page.goto('https://beyondchats.com/blogs/', {
            waitUntil: 'networkidle2',
            timeout: 60000
        });

        console.log('⏳ Waiting for content to load...');
        await page.waitForTimeout(3000);

        // Find pagination and navigate to last page
        console.log('🔍 Looking for pagination...');

        let lastPageNumber = 1;
        try {
            // Try to find pagination elements
            const paginationElements = await page.$$('.pagination button, .pagination a, [class*="page"], [class*="pagination"]');

            if (paginationElements.length > 0) {
                console.log(`Found ${paginationElements.length} pagination elements`);

                // Extract page numbers
                const pageNumbers = await page.evaluate(() => {
                    const buttons = Array.from(document.querySelectorAll('button, a'));
                    const numbers = buttons
                        .map(btn => parseInt(btn.textContent.trim()))
                        .filter(num => !isNaN(num) && num > 0);
                    return numbers.length > 0 ? Math.max(...numbers) : 1;
                });

                lastPageNumber = pageNumbers || 1;
                console.log(`📊 Last page number detected: ${lastPageNumber}`);

                // Navigate to last page if it exists
                if (lastPageNumber > 1) {
                    console.log(`🔄 Navigating to page ${lastPageNumber}...`);

                    // Try clicking last page button
                    const lastPageClicked = await page.evaluate((pageNum) => {
                        const buttons = Array.from(document.querySelectorAll('button, a'));
                        const lastPageBtn = buttons.find(btn =>
                            btn.textContent.trim() === String(pageNum) ||
                            btn.textContent.trim() === 'Last' ||
                            btn.textContent.trim() === '>>'
                        );
                        if (lastPageBtn) {
                            lastPageBtn.click();
                            return true;
                        }
                        return false;
                    }, lastPageNumber);

                    if (lastPageClicked) {
                        await page.waitForTimeout(3000);
                        console.log('✅ Navigated to last page');
                    }
                }
            } else {
                console.log('ℹ️  No pagination found - all articles on single page');
            }
        } catch (paginationError) {
            console.log('⚠️  Pagination detection failed, proceeding with current page');
        }

        // Scrape articles
        console.log('📰 Scraping articles from page...');

        const articles = await page.evaluate(() => {
            const articleElements = Array.from(document.querySelectorAll(
                'article, .article, .blog-post, .post, [class*="article"], [class*="blog"], [class*="card"]'
            ));

            console.log(`Found ${articleElements.length} potential article elements`);

            const scrapedArticles = [];

            for (const element of articleElements) {
                try {
                    // Extract title
                    const titleEl = element.querySelector('h1, h2, h3, h4, .title, [class*="title"], [class*="heading"]');
                    const title = titleEl ? titleEl.textContent.trim() : null;

                    if (!title) continue;

                    // Extract link
                    const linkEl = element.querySelector('a[href]');
                    const url = linkEl ? new URL(linkEl.href, window.location.origin).href : null;

                    // Extract image
                    const imgEl = element.querySelector('img');
                    const imageUrl = imgEl ? (imgEl.src || imgEl.dataset.src) : null;

                    // Extract content/excerpt
                    const contentEls = Array.from(element.querySelectorAll('p, .excerpt, .description, [class*="excerpt"]'));
                    const content = contentEls
                        .map(p => p.textContent.trim())
                        .filter(text => text.length > 20)
                        .join('\n\n') || title;

                    // Extract author
                    const authorEl = element.querySelector('.author, [class*="author"], .by-line, [rel="author"]');
                    const author = authorEl ? authorEl.textContent.replace(/^by\s*/i, '').trim() : 'BeyondChats Team';

                    // Extract date
                    const dateEl = element.querySelector('time, .date, [class*="date"], [datetime]');
                    let publishedDate = new Date();

                    if (dateEl) {
                        const dateStr = dateEl.getAttribute('datetime') || dateEl.textContent.trim();
                        const parsed = new Date(dateStr);
                        if (!isNaN(parsed.getTime())) {
                            publishedDate = parsed;
                        }
                    }

                    scrapedArticles.push({
                        title,
                        content,
                        author,
                        publishedDate: publishedDate.toISOString(),
                        sourceUrl: url || window.location.href,
                        imageUrl: imageUrl || null
                    });

                } catch (err) {
                    console.error('Error parsing article element:', err);
                }
            }

            return scrapedArticles;
        });

        console.log(`✅ Scraped ${articles.length} articles`);

        // Get the 5 oldest articles (from the end of the list)
        const oldestArticles = articles.slice(-5);

        console.log(`📌 Selected ${oldestArticles.length} oldest articles`);

        await browser.close();

        return oldestArticles;

    } catch (error) {
        console.error('❌ Scraping error:', error);
        if (browser) {
            await browser.close();
        }
        throw error;
    }
}

/**
 * Save scraped articles to database
 * @param {Array} articles - Array of article objects
 * @returns {Promise<Array>} Saved articles
 */
async function saveArticlesToDB(articles) {
    try {
        console.log(`💾 Saving ${articles.length} articles to database...`);

        const savedArticles = [];

        for (const articleData of articles) {
            try {
                // Check if article already exists by URL
                const existing = await Article.findOne({ sourceUrl: articleData.sourceUrl });

                if (existing) {
                    console.log(`⏭️  Article already exists: ${articleData.title}`);
                    savedArticles.push(existing);
                    continue;
                }

                // Create new article
                const article = await Article.create({
                    ...articleData,
                    scrapedAt: new Date()
                });

                console.log(`✅ Saved: ${article.title}`);
                savedArticles.push(article);

            } catch (err) {
                console.error(`❌ Error saving article "${articleData.title}":`, err.message);
            }
        }

        console.log(`\n✨ Successfully saved ${savedArticles.length} articles to database`);
        return savedArticles;

    } catch (error) {
        console.error('❌ Database save error:', error);
        throw error;
    }
}

/**
 * Main execution function
 */
async function main() {
    try {
        console.log('\n🎯 BeyondChats Article Scraper - Phase 1\n');

        // Connect to MongoDB
        await connectDB();

        // Scrape articles
        const articles = await scrapeBeyondChatsBlogs();

        if (articles.length === 0) {
            console.log('⚠️  No articles found to scrape');
            process.exit(0);
        }

        // Save to database
        await saveArticlesToDB(articles);

        console.log('\n🎉 Scraping completed successfully!\n');
        process.exit(0);

    } catch (error) {
        console.error('\n💥 Fatal error:', error);
        process.exit(1);
    }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}

export { scrapeBeyondChatsBlogs, saveArticlesToDB };
