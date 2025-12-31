# BeyondChats Article Optimization Platform - Documentation

## 📌 Application Overview

**BeyondChats Article Optimization Platform** is a full-stack web application that demonstrates how to combine **web scraping** with **LLM (Large Language Model) capabilities** to automatically optimize content. The application scrapes articles from BeyondChats blogs, uses Google search to find top-ranking reference articles, and leverages Google Gemini AI to rewrite and enhance the content.

### Use Cases

1. **Content Optimization** - Automatically improve article quality by analyzing competitor content
2. **SEO Enhancement** - Optimize articles based on what ranks well on Google
3. **Research Aggregation** - Combine insights from multiple sources into comprehensive content
4. **Content Benchmarking** - Compare original vs AI-optimized versions side-by-side

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                               │
│                     (React + Vite + Tailwind CSS)                   │
│                        http://localhost:3000                         │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         BACKEND API                                  │
│                    (Express.js + Node.js)                           │
│                        http://localhost:5000                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                 │
│  │   Routes    │──│ Controllers │──│   Models    │                 │
│  └─────────────┘  └─────────────┘  └─────────────┘                 │
└─────────────────────────────────────────────────────────────────────┘
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        ▼                           ▼                           ▼
┌───────────────┐         ┌──────────────────┐         ┌───────────────┐
│   SCRAPER     │         │  GOOGLE SEARCH   │         │    LLM        │
│  (Puppeteer)  │         │  (ScraperAPI)    │         │  (Gemini AI)  │
└───────────────┘         └──────────────────┘         └───────────────┘
        │                           │                           │
        ▼                           ▼                           ▼
┌───────────────┐         ┌──────────────────┐         ┌───────────────┐
│ BeyondChats   │         │  Google Search   │         │ Google Gemini │
│    Blog       │         │    Results       │         │     API       │
└───────────────┘         └──────────────────┘         └───────────────┘
                                    │
                                    ▼
                    ┌───────────────────────────┐
                    │      MongoDB Atlas        │
                    │   (Cloud Database)        │
                    └───────────────────────────┘
```

---

## 📚 Three-Phase Process

### **Phase 1: Web Scraping**
Scrapes the 5 oldest articles from BeyondChats blog using Puppeteer.

```javascript
// Example: backend/src/services/scraper.js
const browser = await puppeteer.launch({ headless: 'new' });
const page = await browser.newPage();
await page.goto('https://beyondchats.com/blogs/');

// Extract article elements
const articles = await page.evaluate(() => {
    const elements = document.querySelectorAll('article, .blog-post');
    return Array.from(elements).map(el => ({
        title: el.querySelector('h1, h2, h3')?.textContent,
        content: el.querySelector('p')?.textContent,
        sourceUrl: el.querySelector('a')?.href
    }));
});
```

**Run scraping:**
```bash
cd backend && npm run scrape
```

### **Phase 2: AI Optimization**
For each article:
1. Search Google for the article title using ScraperAPI
2. Scrape top 2 reference articles
3. Use Gemini AI to optimize content based on references

```javascript
// Example: Optimization flow
const searchResults = await searchGoogle(article.title, 2);
const references = await scrapeReferenceArticles(searchResults);
const optimizedContent = await optimizeArticleContent(
    article.title,
    article.content,
    references
);
```

**Run optimization:**
```bash
cd backend && npm run update
```

### **Phase 3: Frontend Display**
React UI shows side-by-side comparison of original vs optimized articles.

---

## 🔧 How to Do Scraping with LLM

### Step-by-Step Guide

#### 1. **Setup Puppeteer for Web Scraping**

```javascript
import puppeteer from 'puppeteer';

async function scrapeWebsite(url) {
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });
    
    // Extract content
    const content = await page.evaluate(() => {
        return document.body.innerText;
    });
    
    await browser.close();
    return content;
}
```

#### 2. **Setup Google Search for Research**

Use ScraperAPI to search Google without getting blocked:

```javascript
import axios from 'axios';

async function searchGoogle(query) {
    const SCRAPER_API_KEY = process.env.SERP_API_KEY;
    const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    
    const response = await axios.get('https://api.scraperapi.com', {
        params: {
            api_key: SCRAPER_API_KEY,
            url: googleUrl
        }
    });
    
    // Parse HTML to extract URLs
    return parseGoogleResults(response.data);
}
```

#### 3. **Integrate LLM for Content Optimization**

Use Google Gemini API to process and optimize content:

```javascript
import axios from 'axios';

async function optimizeWithLLM(originalContent, referenceArticles) {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
    
    const prompt = `
You are an expert content optimizer. Analyze the original article and reference articles,
then rewrite to be more comprehensive and SEO-friendly.

Original Article:
${originalContent}

Reference Articles:
${referenceArticles.map((ref, i) => `${i+1}. ${ref.title}\n${ref.content}`).join('\n\n')}

Write an improved version:
`;

    const response = await axios.post(
        `${API_URL}?key=${GEMINI_API_KEY}`,
        {
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { 
                temperature: 0.7,
                maxOutputTokens: 8192
            }
        }
    );
    
    return response.data.candidates[0].content.parts[0].text;
}
```

#### 4. **Complete Pipeline Example**

```javascript
async function optimizeArticle(articleTitle) {
    // Step 1: Search for reference articles
    const searchResults = await searchGoogle(articleTitle);
    
    // Step 2: Scrape reference articles
    const references = [];
    for (const result of searchResults.slice(0, 2)) {
        const content = await scrapeWebsite(result.url);
        references.push({
            title: result.title,
            content: content.substring(0, 3000) // Limit length
        });
    }
    
    // Step 3: Fetch original article from database
    const article = await Article.findOne({ title: articleTitle });
    
    // Step 4: Optimize with LLM
    const optimizedContent = await optimizeWithLLM(
        article.content,
        references
    );
    
    // Step 5: Save optimized version
    await Article.updateOne(
        { _id: article._id },
        {
            isUpdated: true,
            updatedContent: optimizedContent,
            references: references.map(r => ({
                title: r.title,
                url: r.url
            }))
        }
    );
    
    return optimizedContent;
}
```

---

## 🔑 Key Components

### Backend Services

| Service | Purpose | Technology |
|---------|---------|------------|
| `scraper.js` | Scrapes BeyondChats blogs | Puppeteer |
| `googleSearch.js` | Searches Google for references | ScraperAPI |
| `contentScraper.js` | Scrapes reference article content | Puppeteer |
| `llmService.js` | Optimizes content with AI | Google Gemini |

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/articles` | GET | List all articles |
| `/api/articles/:id` | GET | Get single article |
| `/api/articles/stats` | GET | Get statistics |

### Environment Variables

```env
MONGODB_URI=mongodb+srv://...    # MongoDB connection string
PORT=5000                         # Server port
SERP_API_KEY=your_key            # ScraperAPI key
GEMINI_API_KEY=your_key          # Google Gemini API key
NODE_ENV=development             # Environment mode
```

---

## 🚀 Running the Application

### Quick Start

```bash
# Terminal 1: Start Backend
cd backend
npm install
npm run dev

# Terminal 2: Start Frontend
cd frontend
npm install
npm run dev
```

### Available Scripts

```bash
# Backend
npm run dev      # Start development server
npm run scrape   # Scrape articles from BeyondChats
npm run update   # Optimize articles with AI

# Frontend
npm run dev      # Start Vite dev server
npm run build    # Build for production
```

---

## 💡 Best Practices for LLM Scraping

1. **Rate Limiting** - Add delays between API calls to avoid hitting rate limits
2. **Error Handling** - Implement retry logic with exponential backoff
3. **Content Truncation** - Limit input length to stay within token limits
4. **Caching** - Store scraped content to avoid redundant requests
5. **Prompt Engineering** - Design clear, structured prompts for better output

### Example: Rate Limiting with Retry

```javascript
async function optimizeWithRetry(content, refs, maxRetries = 3) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await optimizeWithLLM(content, refs);
        } catch (error) {
            if (error.message.includes('rate limit') && attempt < maxRetries) {
                const waitTime = attempt * 3000;
                await new Promise(r => setTimeout(r, waitTime));
            } else {
                throw error;
            }
        }
    }
}
```

---

## 📊 Technology Stack

- **Frontend:** React 18, Vite, Tailwind CSS, React Router
- **Backend:** Node.js, Express.js, Mongoose
- **Database:** MongoDB Atlas
- **AI/ML:** Google Gemini API (LLM)
- **Scraping:** Puppeteer, Cheerio, ScraperAPI
- **DevOps:** Docker, Docker Compose

---

## 📝 Summary

This application demonstrates a powerful pattern:

1. **Scrape** → Collect content from target websites
2. **Research** → Find competitor/reference content via search
3. **Optimize** → Use LLM to enhance content based on research
4. **Compare** → Display original vs optimized versions

This pattern can be adapted for:
- Blog optimization
- Product description enhancement
- Documentation improvement
- Content marketing automation
- SEO-driven content creation

---

**Built by PAMIDI ROHIT**
