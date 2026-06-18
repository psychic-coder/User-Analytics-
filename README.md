# User Analytics Tracker

A full-stack application for tracking user interactions, storing them in MongoDB, and visualizing sessions and click heatmaps through a React dashboard.

## Services
- **Backend**: Node.js + Express + TypeScript on port 5000
- **Dashboard**: React 19 + TypeScript + Vite on port 3000
- **Tracker**: Vanilla JS tracking SDK
- **MongoDB**: Storage

## Getting Started

## Environment Variables

Before starting the application, you need to set up your environment variables. 

1. Duplicate `apps/server/.env.example` and rename it to `.env` inside the `apps/server/` directory.
2. Duplicate `apps/dashboard/.env.example` and rename it to `.env` inside the `apps/dashboard/` directory.

```bash
# Install dependencies
npm install

# Run backend and dashboard locally
npm run dev

# Run using docker
docker compose up
```
