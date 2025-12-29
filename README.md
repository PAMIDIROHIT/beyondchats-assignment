# BeyondChats Article Optimization Platform

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> A full-stack web application that scrapes articles from BeyondChats, optimizes them using AI (Google Gemini), and provides a beautiful comparison interface.

**Author:** PAMIDI ROHIT  
**Assignment:** BeyondChats Full-Stack Development

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Environment Variables](#environment-variables)
- [Docker Deployment](#docker-deployment)
- [Development](#development)
- [Screenshots](#screenshots)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

## 🎯 Overview

This project is a comprehensive solution for article content optimization using AI. It consists of three main phases:

### **Phase 1: Web Scraping & Storage**
- Scrapes articles from [BeyondChats Blog](https://beyondchats.com/blogs/)
- Extracts the 5 oldest articles from the last page
- Stores in MongoDB with full metadata
- Provides RESTful CRUD APIs

### **Phase 2: AI-Powered Optimization**
- Searches article titles on Google using SerpAPI
- Scrapes top-ranking reference articles
- Uses Google Gemini AI to optimize content
- Generates SEO-friendly, comprehensive articles
- Maintains references to source articles

### **Phase 3: React Frontend**
- Beautiful, responsive UI built with React + Vite + Tailwind CSS
- Side-by-side comparison of original vs optimized articles
- Toggle view for easy reading
- Professional design with smooth animations
- Mobile-first responsive design

---

## ✨ Features

### Backend
- ✅ **Web Scraping** with Puppeteer for dynamic content
- ✅ **MongoDB Atlas** integration for data persistence
- ✅ **Google Search** via SerpAPI
- ✅ **AI Content Optimization** using Google Gemini
- ✅ **RESTful APIs** with Express.js
- ✅ **Error Handling** and retry logic
- ✅ **Rate Limiting** and security headers
- ✅ **Comprehensive Logging** for debugging

### Frontend
- ✅ **Modern UI** with Tailwind CSS
- ✅ **Responsive Design** (mobile, tablet, desktop)
- ✅ **Side-by-Side Comparison** view
- ✅ **Toggle Mode** for content viewing
- ✅ **Loading States** and skeletons
- ✅ **Toast Notifications** for user feedback
- ✅ **Filter & Pagination** for articles
- ✅ **Professional Styling** with gradients and animations

### DevOps
- ✅ **Docker** containerization
- ✅ **Docker Compose** for orchestration
- ✅ **Environment Variables** for configuration
- ✅ **Health Checks** for monitoring

---

## 🏗️ Architecture

```mermaid
graph TB
    subgraph "Frontend Layer"
        UI[React UI<br/>Vite + Tailwind CSS]
        ROUTER[React Router]
        AXIOS[Axios Client]
    end
    
    subgraph "Backend Layer"
        SERVER[Express Server<br/>Port 5000]
        ROUTES[API Routes]
        CONTROLLERS[Controllers]
        MIDDLEWARE[Middleware<br/>CORS, Rate Limit, Security]
    end
    
    subgraph "Business Logic"
        SCRAPER[BeyondChats Scraper<br/>Puppeteer]
        GOOGLE[Google Search<br/>SerpAPI]
        CONTENT[Content Scraper<br/>Puppeteer]
        LLM[Gemini AI<br/>Content Optimization]
    end
    
    subgraph "Data Layer"
        MODELS[Mongoose Models]
        MONGO[(MongoDB Atlas)]
    end
    
    subgraph "External APIs"
        BEYONDCHATS[BeyondChats Blog]
        SERPAPI[SerpAPI]
        GEMINI[Google Gemini API]
    end
    
    UI --> ROUTER
    ROUTER --> AXIOS
    AXIOS --> MIDDLEWARE
    MIDDLEWARE --> SERVER
    SERVER --> ROUTES
    ROUTES --> CONTROLLERS
    CONTROLLERS --> MODELS
    MODELS --> MONGO
    
    CONTROLLERS --> SCRAPER
    CONTROLLERS --> GOOGLE
    CONTROLLERS --> CONTENT
    CONTROLLERS --> LLM
    
    SCRAPER --> BEYONDCHATS
    GOOGLE --> SERPAPI
    CONTENT --> SCRAPER
    LLM --> GEMINI
    
    style UI fill:#4f46e5,color:#fff
    style SERVER fill:#10b981,color:#fff
    style MONGO fill:#f59e0b,color:#fff
    style GEMINI fill:#8b5cf6,color:#fff
```

### Data Flow

1. **Scraping Phase** (Phase 1)
   ```
   BeyondChats Blog → Puppeteer → Parse HTML → MongoDB
   ```

2. **Optimization Phase** (Phase 2)
   ```
   MongoDB → Article → Google Search (SerpAPI) → Reference URLs
   → Puppeteer (Scrape) → Reference Content → Gemini AI
   → Optimized Content → MongoDB
   ```

3. **Viewing Phase** (Phase 3)
   ```
   React UI → API Request → Express → MongoDB
   → JSON Response → React Components → User
   ```

---

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Database:** MongoDB Atlas (Cloud)
- **ODM:** Mongoose
- **Web Scraping:** Puppeteer, Cheerio
- **HTTP Client:** Axios
- **AI:** Google Gemini (generative-ai)
- **Search:** SerpAPI
- **Security:** Helmet, CORS, Rate Limiting
- **Validation:** Express-validator

### Frontend
- **Framework:** React 18
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router v6
- **HTTP:** Axios
- **Notifications:** React Hot Toast
- **Fonts:** Google Fonts (Inter)

### DevOps
- **Containerization:** Docker
- **Orchestration:** Docker Compose
- **Web Server:** Nginx (for frontend)

---

## 📁 Project Structure

```
beyondchats-assignment/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js          # MongoDB connection
│   │   ├── models/
│   │   │   └── Article.js           # Mongoose schema
│   │   ├── routes/
│   │   │   └── articles.js          # API routes
│   │   ├── controllers/
│   │   │   └── articleController.js # Business logic
│   │   ├── services/
│   │   │   ├── scraper.js           # BeyondChats scraper
│   │   │   ├── googleSearch.js      # Google search via SerpAPI
│   │   │   ├── contentScraper.js    # Article content scraper
│   │   │   └── llmService.js        # Gemini AI integration
│   │   ├── scripts/
│   │   │   └── updateArticles.js    # Automation script
│   │   └── server.js                # Express server
│   ├── Dockerfile
│   ├── package.json
│   ├── .env.example
│   └── .env                         # (not in git)
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ArticleCard.jsx
│   │   │   ├── ArticleDetail.jsx
│   │   │   └── ComparisonView.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   └── ArticleComparison.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── public/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

## 🚀 Installation

### Prerequisites
- Node.js 18+ ([Download](https://nodejs.org/))
- MongoDB Atlas account ([Sign up](https://www.mongodb.com/cloud/atlas))
- SerpAPI key ([Get key](https://serpapi.com/))
- Google Gemini API key ([Get key](https://makersuite.google.com/app/apikey))
- Docker (optional, for containerized deployment)

### Local Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/PAMIDIROHIT/beyondchats-assignment.git
   cd beyondchats-assignment
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Create Environment File**
   ```bash
   cp .env.example .env
   ```

4. **Configure Environment Variables**
   Edit `backend/.env`:
   ```env
   MONGODB_URI=mongodb+srv://rohithtnsp_db_user:7286027547Rr@cluster0.u35a7rh.mongodb.net/beyondchats?retryWrites=true&w=majority
   PORT=5000
   SERP_API_KEY=95990ca36aeda7904e9def6e45e67ee3
   GEMINI_API_KEY=AIzaSyDG3F7Mw4OJo4kGTzTGqDoS_z9FeNs4xaE
   NODE_ENV=development
   ```

5. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

---

## 💻 Usage

### Running Locally

1. **Start Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   Server will start at `http://localhost:5000`

2. **Start Frontend**
   ```bash
   cd frontend
   npm run dev
   ```
   UI will open at `http://localhost:3000`

### Running Scripts

1. **Scrape Articles (Phase 1)**
   ```bash
   cd backend
   npm run scrape
   ```
   This will:
   - Navigate to BeyondChats blogs
   - Find the last page
   - Scrape 5 oldest articles
   - Save to MongoDB

2. **Optimize Articles (Phase 2)**
   ```bash
   cd backend
   npm run update
   ```
   This will:
   - Fetch articles from database
   - Search Google for each article
   - Scrape top 2 reference articles
   - Use Gemini AI to optimize content
   - Update database with new content and references

---

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### 1. Health Check
```http
GET /api/health
```
**Response:**
```json
{
  "success": true,
  "message": "API is healthy",
  "database": "Connected",
  "timestamp": "2025-12-29T07:20:00.000Z"
}
```

#### 2. Get All Articles
```http
GET /api/articles?page=1&limit=10&isUpdated=true
```
**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `isUpdated` (optional): Filter by update status (true/false)

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalArticles": 25,
    "hasNext": true,
    "hasPrev": false
  }
}
```

#### 3. Get Article by ID
```http
GET /api/articles/:id
```
**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "title": "...",
    "content": "...",
    "author": "...",
    "publishedDate": "...",
    "sourceUrl": "...",
    "imageUrl": "...",
    "isUpdated": true,
    "updatedContent": "...",
    "references": [...]
  }
}
```

#### 4. Create Article
```http
POST /api/articles
Content-Type: application/json

{
  "title": "Article Title",
  "content": "Article content...",
  "author": "Author Name",
  "sourceUrl": "https://example.com/article",
  "imageUrl": "https://example.com/image.jpg"
}
```

#### 5. Update Article
```http
PUT /api/articles/:id
Content-Type: application/json

{
  "title": "Updated Title",
  "isUpdated": true,
  "updatedContent": "...",
  "references": [...]
}
```

#### 6. Delete Article
```http
DELETE /api/articles/:id
```

#### 7. Get Statistics
```http
GET /api/articles/stats
```
**Response:**
```json
{
  "success": true,
  "data": {
    "total": 25,
    "updated": 10,
    "notUpdated": 15,
    "updatePercentage": "40.00"
  }
}
```

---

## ⚙️ Environment Variables

### Backend (.env)
| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `MONGODB_URI` | MongoDB connection string | ✅ Yes | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `PORT` | Server port | ✅ Yes | `5000` |
| `SERP_API_KEY` | SerpAPI key for Google search | ✅ Yes | `your_serpapi_key` |
| `GEMINI_API_KEY` | Google Gemini API key | ✅ Yes | `your_gemini_key` |
| `NODE_ENV` | Environment mode | No | `development` or `production` |

### Frontend (.env)
| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `VITE_API_URL` | Backend API URL | No | `http://localhost:5000/api` |

---

## 🐳 Docker Deployment

### Quick Start with Docker Compose

1. **Build and Run**
   ```bash
   docker-compose up --build
   ```

2. **Access Application**
   - Frontend: `http://localhost:3000`
   - Backend: `http://localhost:5000`

3. **Stop Services**
   ```bash
   docker-compose down
   ```

### Individual Docker Commands

**Backend:**
```bash
cd backend
docker build -t beyondchats-backend .
docker run -p 5000:5000 --env-file .env beyondchats-backend
```

**Frontend:**
```bash
cd frontend
docker build -t beyondchats-frontend .
docker run -p 3000:80 beyondchats-frontend
```

---

## 🧑‍💻 Development

### Coding Standards
- ✅ ES6+ JavaScript
- ✅ Async/await for asynchronous operations
- ✅ Comprehensive error handling with try-catch
- ✅ Detailed console logging
- ✅ Clean, commented code
- ✅ Modular, reusable components

### Best Practices
- Environment variables for configuration
- Input validation using express-validator
- Rate limiting on APIs
- CORS configuration
- Security headers with Helmet
- Graceful error messages

---

## 📸 Screenshots

*Screenshots will be added after deployment*

### Homepage
- Grid view of all articles
- Filter by optimization status
- Pagination controls

### Article Comparison
- Side-by-side view of original vs optimized
- Toggle mode for easy reading
- References section with source links

### Mobile View
- Fully responsive design
- Stack layout on mobile devices

---

## 🔧 Troubleshooting

### Common Issues

**1. MongoDB Connection Failed**
```
Error: MongooseServerSelectionError: Could not connect to any servers
```
**Solution:** Verify MongoDB URI and whitelist your IP in MongoDB Atlas.

**2. Puppeteer Launch Error**
```
Error: Failed to launch the browser process
```
**Solution:** Install Chromium dependencies:
```bash
sudo apt-get install -y chromium-browser
```

**3. API Rate Limit Exceeded**
```
Error: SerpAPI rate limit exceeded
```
**Solution:** Wait for rate limit to reset or upgrade SerpAPI plan.

**4. Port Already in Use**
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:** Kill existing process:
```bash
lsof -ti:5000 | xargs kill -9
```

---

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**PAMIDI ROHIT**
- GitHub: [@PAMIDIROHIT](https://github.com/PAMIDIROHIT)
- Email: rohithtnsp@gmail.com

---

## 🙏 Acknowledgments

- [BeyondChats](https://beyondchats.com/) for the assignment
- Google Gemini for AI capabilities
- SerpAPI for search functionality
- MongoDB Atlas for database hosting

---

## 📞 Support

For issues or questions:
1. Check [Troubleshooting](#troubleshooting) section
2. Open an issue on [GitHub](https://github.com/PAMIDIROHIT/beyondchats-assignment/issues)
3. Contact: rohithtnsp@gmail.com

---

**Built with ❤️ by PAMIDI ROHIT**
