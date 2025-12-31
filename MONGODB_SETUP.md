# MongoDB Atlas IP Whitelist Setup

## Your Current IP Address
**122.186.156.30**

## Step-by-Step Instructions

### 1. Login to MongoDB Atlas
- Go to: https://cloud.mongodb.com/
- Login with your credentials

### 2. Navigate to Network Access
- In the left sidebar, click **"Network Access"**
- You'll see a list of whitelisted IPs (might be empty)

### 3. Add IP Address
- Click the green **"Add IP Address"** button

### 4. Configure IP Whitelist
**Option A - Quick (Recommended for Development):**
- Click the **"Allow Access from Anywhere"** button
- This will set IP to: `0.0.0.0/0`
- Click **"Confirm"**

**Option B - Secure (Production):**
- In the "Access List Entry" field, enter: `122.186.156.30`
- Add a comment: "Development Machine"
- Click **"Confirm"**

### 5. Wait for Propagation
- Wait **1-2 minutes** for changes to take effect
- MongoDB will show "Pending" then "Active"

### 6. Test Connection
After whitelisting, run:
```bash
cd /home/mohanganesh/ROHIT/beyondchats/beyondchats-assignment/backend
npm run scrape
```

## Expected Output After Whitelisting
```
✅ MongoDB Connected: cluster0.u35a7rh.mongodb.net
📰 Scraping articles from page...
✅ Scraped 5 articles
💾 Saving 5 articles to database...
✅ Saved: [Article titles]
🎉 Scraping completed successfully!
```

## Current Issue
The scraper successfully fetched articles from BeyondChats but cannot save them because MongoDB Atlas is blocking the connection due to IP restrictions.

## Once Complete
- Refresh http://localhost:3000
- You'll see 5 articles in the grid
- Click any article to view comparison
- Run `npm run update` to optimize with AI

---

**Need help?** Let me know if you encounter any issues!
