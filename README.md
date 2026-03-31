# Rio Screenshot Hub

A personal AI-powered screenshot interpreter built for Rio — real estate team leader in Phoenix, AZ. Drop any screenshot and the app instantly classifies it and extracts actionable data: client conversations → calendar events, restaurants → Maps links, market stats → copyable content, and more.

## What it does

Six detection modes, each with tailored actions:

- **CLIENT_CONVO** — extracts client name, contact, meeting type, time → Google Calendar pre-fill, SMS and email deep links
- **RESTAURANT** — name, cuisine, price, rating, hours → Google Maps, table reservation, 8PM reminder, copy share text
- **MOVIE** — title, year, platform, synopsis → find where to watch, 8PM reminder
- **SOCIAL_CONTENT** — hook, caption in Rio's voice, hashtags → copy caption, copy hook + hashtags
- **MARKET_STATS** — headline, key stats, Phoenix relevance analysis → copy for content
- **NOTE** — title, content, category, actionable flag → copy, add as calendar task

All sessions persist in localStorage and are accessible in the right-side history panel.

## Run locally

```bash
# 1. Install dependencies
npm install

# 2. Set up your API key
cp .env.local.example .env.local
# Edit .env.local and add your key

# 3. Start the dev server
npm run dev
```

Open http://localhost:3000

## Setting the Anthropic API key

1. Copy the example file:
   ```bash
   cp .env.local.example .env.local
   ```
2. Open `.env.local` and replace `your_anthropic_api_key_here` with your actual key from https://console.anthropic.com/
3. The key is only used server-side and is never exposed to the browser.

## Deploy to Vercel (new project)

This app should be deployed as a brand-new Vercel project completely separate from any existing deployments.

### 1. Create a new GitHub repo

```bash
git init
git add .
git commit -m "Initial commit — Rio Screenshot Hub"
```

Go to https://github.com/new and create a new repository named `rio-screenshot-hub`. Then push:

```bash
git remote add origin https://github.com/YOUR_USERNAME/rio-screenshot-hub.git
git branch -M main
git push -u origin main
```

### 2. Import into Vercel

1. Go to https://vercel.com/new
2. Click **Import Git Repository**
3. Select your `rio-screenshot-hub` repo
4. Leave all build settings at defaults (Next.js is auto-detected)
5. Before clicking Deploy, expand **Environment Variables** and add:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** your Anthropic API key
6. Click **Deploy**

Vercel will build and deploy automatically on every push to `main`.
