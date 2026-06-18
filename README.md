# CausalFunnel Analytics Challenge

A full-stack user analytics application that tracks user interactions (page views and clicks), stores them in MongoDB, and visualizes sessions and click heatmaps through a React dashboard.

## Demo

The application comes with a dummy testing page that includes the tracking SDK, and a script to seed the database with hundreds of realistic demo events.

## Tech Stack

- **Client SDK (Tracker)**: Vanilla JavaScript
  - Tracks `page_view` and `click`
  - Captures Session ID (localStorage with cookie fallback), URL, Timestamp, and X/Y coordinates
  - Debounced click tracking to optimize performance
  - Queues events offline and flushes them when the connection is restored
- **Backend API**: Node.js + Express + TypeScript
  - Exposes REST endpoints to receive events and serve analytics data
  - Mongoose for MongoDB schemas and querying
  - CORS, Helmet, and Rate Limiting for security
- **Database**: MongoDB (Atlas)
  - Stores all events with a unified schema
- **Dashboard**: React 19 + TypeScript + Vite + Tailwind CSS
  - React Query for data fetching
  - Custom HTML5 Canvas implementation for heatmap generation

## Setup Steps

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- Node.js (if running scripts locally)

### Running with Docker (Recommended)

1. **Start the application**
   From the root of the project, run:
   ```bash
   docker compose up --build
   ```

2. **Access the services**
   - **Dashboard**: [http://localhost:3000](http://localhost:3000)
   - **Demo Tracking Page**: [http://localhost:3001](http://localhost:3001)
   - **Backend API**: [http://localhost:5001](http://localhost:5001)

### Optional: Seed the Database

If you'd like to test the dashboard with realistic data, run the seed script:
```bash
node seed.js
```
This bypasses the API rate limit and inserts 1,000+ demo events into the MongoDB database directly.

## Assumptions & Trade-offs

- **Session Identification**: We rely on `localStorage` with a fallback to `document.cookie` to store session UUIDs. While this works well for standard browsers, users clearing cookies/local storage or using incognito mode will generate new session IDs.
- **Heatmap Rendering**: The heatmap uses a custom Canvas-based radial gradient approach rather than relying on heavy external libraries like `heatmap.js`. This is significantly more lightweight, though it might need optimization (e.g. WebGL) if plotting hundreds of thousands of concurrent points on a single view.
- **Batching vs. Real-time**: The SDK currently sends events almost immediately (with debouncing for rapid clicks). In a true high-scale production environment, we would queue events and send them in batches using `navigator.sendBeacon()` on page unload or every X seconds to reduce server load.
- **Docker Images**: We use lightweight `node:18-alpine` images for all services to minimize the footprint.
- **Rate Limiting**: Set to 100 requests per minute per IP to prevent spam attacks, which is why the seed script injects directly into the DB.
