/**
 * LLM Service - Phase 2
 * Uses Google Gemini API to optimize article content
 */

import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Use REST API directly for better compatibility
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

/**
 * Generate optimized article content using Gemini REST API
 * @param {string} originalTitle - Original article title
 * @param {string} originalContent - Original article content
 * @param {Array} referenceArticles - Array of reference articles with title and content
 * @returns {Promise<string>} Optimized article content
 */
export async function optimizeArticleContent(originalTitle, originalContent, referenceArticles) {
    try {
        if (!GEMINI_API_KEY) {
            throw new Error('Gemini API is not configured');
        }

        console.log(`🤖 Optimizing article: "${originalTitle}"`);
        console.log(`📚 Using ${referenceArticles.length} reference articles`);

        // Build the prompt
        const prompt = buildOptimizationPrompt(originalTitle, originalContent, referenceArticles);

        console.log(`📝 Prompt length: ${prompt.length} characters`);

        // Call Gemini REST API directly
        const response = await axios.post(
            `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
            {
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 8192,
                }
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 60000
            }
        );

        // Extract generated text
        const optimizedContent = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!optimizedContent) {
            throw new Error('No content generated from Gemini');
        }

        console.log(`✅ Generated ${optimizedContent.length} characters of optimized content`);

        return optimizedContent;

    } catch (error) {
        console.error('❌ LLM optimization error:', error.message);

        // Check for specific error types
        if (error.response) {
            console.error('API Response Error:', error.response.status, error.response.data);

            if (error.response.status === 401 || error.response.status === 403) {
                throw new Error('Invalid Gemini API key');
            } else if (error.response.status === 429) {
                throw new Error('Gemini API quota exceeded');
            }
        }

        throw error;
    }
}

/**
 * Build optimization prompt for LLM
 * @param {string} originalTitle - Original article title
 * @param {string} originalContent - Original article content
 * @param {Array} referenceArticles - Reference articles
 * @returns {string} Formatted prompt
 */
function buildOptimizationPrompt(originalTitle, originalContent, referenceArticles) {
    // Limit content length to avoid token limits
    const maxContentLength = 3000;
    const truncatedOriginal = originalContent.substring(0, maxContentLength);

    const referenceTexts = referenceArticles
        .map((ref, index) => {
            const truncatedRef = ref.content.substring(0, maxContentLength);
            return `
### Reference Article ${index + 1}: ${ref.title}

${truncatedRef}
`;
        })
        .join('\n\n');

    const prompt = `You are an expert content optimizer and SEO specialist. Your task is to rewrite and enhance an article to make it more comprehensive, engaging, and SEO-friendly.

## Instructions:

1. **Analyze** the original article and the two top-ranking reference articles
2. **Identify** the key topics, structure, style, and depth of the reference articles
3. **Rewrite** the original article to:
   - Match the professional tone and style of top-ranking articles
   - Incorporate relevant insights and approaches from reference articles
   - Maintain the original message and core ideas
   - Add more depth, examples, and explanations where appropriate
   - Improve readability with clear headings and paragraphs
   - Optimize for SEO without keyword stuffing
   - Make it comprehensive and valuable to readers

4. **Format** using markdown with:
   - Clear H2 (##) and H3 (###) headings
   - Well-structured paragraphs
   - Bullet points or numbered lists where appropriate
   - Bold for emphasis on key points

5. **Return ONLY the optimized article content** - no meta-commentary, no explanations, just the article

## Original Article: ${originalTitle}

${truncatedOriginal}

${referenceTexts}

## Your Task:

Write an improved version of "${originalTitle}" that combines the best elements from the reference articles while preserving the original message. Make it:
- More comprehensive and detailed
- Better structured with clear sections
- More engaging and readable
- SEO-optimized naturally
- Professional and authoritative

Begin your optimized article now:`;

    return prompt;
}

/**
 * Optimize article with retry logic
 * @param {string} originalTitle - Original article title
 * @param {string} originalContent - Original article content
 * @param {Array} referenceArticles - Reference articles
 * @param {number} maxRetries - Maximum retry attempts
 * @returns {Promise<string>} Optimized content
 */
export async function optimizeWithRetry(originalTitle, originalContent, referenceArticles, maxRetries = 3) {
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await optimizeArticleContent(originalTitle, originalContent, referenceArticles);
        } catch (error) {
            lastError = error;

            if ((error.message.includes('rate limit') || error.message.includes('quota')) && attempt < maxRetries) {
                const waitTime = attempt * 3000; // Exponential backoff
                console.log(`⏳ Rate limited, waiting ${waitTime}ms before retry ${attempt}/${maxRetries}...`);
                await new Promise(resolve => setTimeout(resolve, waitTime));
            } else {
                break;
            }
        }
    }

    throw lastError;
}

/**
 * Test LLM connection
 * @returns {Promise<boolean>} True if connection successful
 */
export async function testConnection() {
    try {
        if (!GEMINI_API_KEY) {
            return false;
        }

        const response = await axios.post(
            `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
            {
                contents: [{
                    parts: [{
                        text: 'Say "Hello, BeyondChats!"'
                    }]
                }]
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 10000
            }
        );

        const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        console.log('✅ Gemini API connection successful:', text);
        return true;

    } catch (error) {
        console.error('❌ Gemini API connection failed:', error.message);
        return false;
    }
}

export default {
    optimizeArticleContent,
    optimizeWithRetry,
    testConnection
};
