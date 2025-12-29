# BeyondChats Backend

Backend API server for article scraping and optimization.

## Features
- MongoDB integration
- Web scraping with Puppeteer
- Google Search integration (SerpAPI)
- AI content optimization (Google Gemini)
- RESTful CRUD APIs
- Automated article optimization pipeline

## Scripts

```bash
# Start development server
npm run dev

# Start production server
npm start

# Scrape articles from BeyondChats (Phase 1)
npm run scrape

# Optimize articles with AI (Phase 2)
npm run update
```

## Environment Variables

Create a `.env` file in the backend directory:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
SERP_API_KEY=your_serpapi_key
GEMINI_API_KEY=your_gemini_api_key
NODE_ENV=development
```

## API Endpoints

- `GET /api/articles` - Get all articles with pagination
- `GET /api/articles/:id` - Get single article
- `POST /api/articles` - Create article
- `PUT /api/articles/:id` - Update article
- `DELETE /api/articles/:id` - Delete article
- `GET /api/articles/stats` - Get statistics
- `GET /api/health` - Health check

See main README for full documentation.
