/**
 * Article Update Automation Script - Phase 2
 * Fetches articles, searches Google, scrapes content, and uses LLM to optimize
 */

import axios from 'axios';
import dotenv from 'dotenv';
import { connectDB } from '../config/database.js';
import Article from '../models/Article.js';
import { searchWithRetry } from '../services/googleSearch.js';
import { scrapeArticleContent } from '../services/contentScraper.js';
import { optimizeWithRetry } from '../services/llmService.js';

dotenv.config();

const API_BASE_URL = `http://localhost:${process.env.PORT || 5000}/api`;

/**
 * Fetch all articles from API
 * @returns {Promise<Array>} Array of articles
 */
async function fetchArticles() {
    try {
        console.log('📥 Fetching articles from API...');

        const response = await axios.get(`${API_BASE_URL}/articles`, {
            params: {
                limit: 100, // Get all articles
                page: 1
            }
        });

        const articles = response.data.data || [];
        console.log(`✅ Fetched ${articles.length} articles`);

        return articles;

    } catch (error) {
        console.error('❌ Error fetching articles:', error.message);

        // If API fails, fetch directly from database
        console.log('🔄 Falling back to direct database query...');
        const articles = await Article.find({}).lean();
        console.log(`✅ Fetched ${articles.length} articles from database`);

        return articles;
    }
}

/**
 * Update single article with optimized content
 * @param {Object} article - Article object
 * @returns {Promise<Object>} Updated article
 */
async function updateSingleArticle(article) {
    try {
        console.log('\n' + '═'.repeat(70));
        console.log(`🔄 Processing: ${article.title}`);
        console.log('═'.repeat(70));

        // Skip if already updated
        if (article.isUpdated) {
            console.log('⏭️  Article already updated, skipping...');
            return article;
        }

        // Step 1: Search Google for article title
        console.log('\n📍 Step 1: Searching Google...');
        const searchResults = await searchWithRetry(article.title, 2);

        if (searchResults.length === 0) {
            console.log('⚠️  No search results found, skipping article');
            return article;
        }

        console.log(`   Found ${searchResults.length} reference URLs`);

        // Step 2: Scrape content from reference articles
        console.log('\n📍 Step 2: Scraping reference articles...');
        const referenceArticles = [];

        for (let i = 0; i < Math.min(searchResults.length, 2); i++) {
            const result = searchResults[i];
            console.log(`\n   Scraping reference ${i + 1}: ${result.title}`);

            const scrapedContent = await scrapeArticleContent(result.url);

            if (!scrapedContent.error && scrapedContent.content.length > 100) {
                referenceArticles.push({
                    title: scrapedContent.title || result.title,
                    url: result.url,
                    content: scrapedContent.content
                });
                console.log(`   ✅ Scraped ${scrapedContent.content.length} characters`);
            } else {
                console.log('   ⚠️  Failed to scrape sufficient content');
            }

            // Delay between scrapes
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        if (referenceArticles.length === 0) {
            console.log('⚠️  No valid reference articles scraped, skipping optimization');
            return article;
        }

        console.log(`✅ Successfully scraped ${referenceArticles.length} reference articles`);

        // Step 3: Use LLM to optimize content
        console.log('\n📍 Step 3: Optimizing content with Gemini AI...');

        const optimizedContent = await optimizeWithRetry(
            article.title,
            article.content,
            referenceArticles,
            3 // max retries
        );

        console.log(`✅ Generated optimized content (${optimizedContent.length} characters)`);

        // Step 4: Update article in database
        console.log('\n📍 Step 4: Updating article in database...');

        const references = referenceArticles.map(ref => ({
            title: ref.title,
            url: ref.url
        }));

        // Update via API
        try {
            await axios.put(`${API_BASE_URL}/articles/${article._id}`, {
                isUpdated: true,
                updatedContent: optimizedContent,
                references: references,
                lastUpdated: new Date()
            });
            console.log('✅ Article updated via API');
        } catch (apiError) {
            // Fallback to direct database update
            console.log('⚠️  API update failed, updating database directly...');
            await Article.findByIdAndUpdate(article._id, {
                isUpdated: true,
                updatedContent: optimizedContent,
                references: references,
                lastUpdated: new Date()
            });
            console.log('✅ Article updated in database');
        }

        console.log('🎉 Article processing completed successfully!\n');

        return {
            ...article,
            isUpdated: true,
            updatedContent: optimizedContent,
            references
        };

    } catch (error) {
        console.error(`\n❌ Error processing article "${article.title}":`, error.message);
        console.error('Stack:', error.stack);
        return article;
    }
}

/**
 * Main automation function
 */
async function main() {
    try {
        console.log('\n' + '█'.repeat(70));
        console.log('🚀 BeyondChats Article Update Automation - Phase 2');
        console.log('█'.repeat(70) + '\n');

        // Connect to database
        await connectDB();

        // Fetch all articles
        const articles = await fetchArticles();

        if (articles.length === 0) {
            console.log('⚠️  No articles found. Please run the scraper first.');
            process.exit(0);
        }

        // Filter articles that need updating
        const toUpdate = articles.filter(a => !a.isUpdated);
        const alreadyUpdated = articles.length - toUpdate.length;

        console.log('\n📊 Statistics:');
        console.log(`   Total articles: ${articles.length}`);
        console.log(`   Already updated: ${alreadyUpdated}`);
        console.log(`   To be updated: ${toUpdate.length}`);
        console.log('');

        if (toUpdate.length === 0) {
            console.log('✨ All articles are already updated!');
            process.exit(0);
        }

        // Process each article
        const results = {
            success: 0,
            failed: 0,
            skipped: 0
        };

        for (let i = 0; i < toUpdate.length; i++) {
            const article = toUpdate[i];

            console.log(`\n📌 Processing article ${i + 1} of ${toUpdate.length}`);

            try {
                const updated = await updateSingleArticle(article);

                if (updated.isUpdated && updated.updatedContent) {
                    results.success++;
                } else {
                    results.skipped++;
                }

            } catch (error) {
                console.error(`Failed to process article:`, error.message);
                results.failed++;
            }

            // Delay between articles to avoid rate limits
            if (i < toUpdate.length - 1) {
                const delay = 5000;
                console.log(`\n⏳ Waiting ${delay}ms before next article...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }

        // Print final summary
        console.log('\n' + '█'.repeat(70));
        console.log('📊 FINAL SUMMARY');
        console.log('█'.repeat(70));
        console.log(`✅ Successfully updated: ${results.success}`);
        console.log(`⏭️  Skipped: ${results.skipped}`);
        console.log(`❌ Failed: ${results.failed}`);
        console.log(`📝 Total processed: ${toUpdate.length}`);
        console.log('█'.repeat(70) + '\n');

        console.log('🎉 Automation completed!\n');
        process.exit(0);

    } catch (error) {
        console.error('\n💥 Fatal error:', error);
        console.error('Stack:', error.stack);
        process.exit(1);
    }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}

export default main;
