# Spreadsheet Pro - Deployment Guide

## Overview
This is a production-ready React spreadsheet application similar to Google Sheets with token-based authentication and backend API integration.

## Features
- ✅ Token-based authentication
- ✅ Dynamic spreadsheet grid with add/remove rows/columns
- ✅ Cell editing with formula support
- ✅ Real-time updates and auto-saving
- ✅ Professional UI with TailwindCSS
- ✅ React Router for navigation
- ✅ Backend API integration
- ✅ Production deployment ready

## Environment Setup

### Development
1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Update the environment variables:
```env
VITE_API_BASE_URL=http://localhost:8080
```

### Production
Set the following environment variables in your deployment platform:
- `VITE_API_BASE_URL` - Your backend API URL

## Available Scripts

### Development
```bash
npm install
npm run dev
```

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Deployment Platforms

### Vercel
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Netlify
1. Connect your GitHub repository to Netlify
2. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Set environment variables in Netlify dashboard

### Other Platforms
The app builds to static files in the `dist` directory and can be deployed to any static hosting service.

## Backend API Requirements

The app expects the following backend endpoints:

### Authentication
- Token-based authentication using Bearer tokens
- Tokens should be passed in `Authorization: Bearer <token>` header

### API Endpoints

#### Create Sheet
```
POST /v1/sheet
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "Sheet Name",
  "rowCount": 100,
  "columnCount": 26
}
```

#### Get Sheet
```
GET /v1/sheet/:sheetId
Authorization: Bearer <token>
```

#### Update Sheet Data
```
PUT /v1/sheet-data/:sheetId
Content-Type: application/json
Authorization: Bearer <token>

{
  "cells": [
    {
      "cellRef": "A1",
      "value": "Hello World"
    },
    {
      "cellRef": "B1", 
      "value": "=SUM(A1:A2)"
    }
  ]
}
```

### Response Format

#### Sheet Object
```json
{
  "id": "sheet_123",
  "name": "My Sheet",
  "cells": [
    {
      "cellRef": "A1",
      "value": "Hello World"
    }
  ],
  "rowCount": 100,
  "columnCount": 26,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

## Usage

1. **Login**: Enter your Bearer token on the login page
2. **Create Sheet**: Navigate to `/sheet` to create a new spreadsheet
3. **Edit Sheet**: Navigate to `/sheet/:sheetId` to edit an existing sheet
4. **Cell Editing**: Click any cell to edit its value or enter formulas
5. **Add/Remove**: Use toolbar buttons to add/remove rows and columns

## Architecture

- **Frontend**: React 18 + TypeScript + Vite
- **UI**: TailwindCSS + shadcn/ui components
- **Spreadsheet**: react-data-grid for high-performance grid
- **State**: React hooks + TanStack Query for server state
- **Routing**: React Router v6
- **Auth**: Cookie-based token storage
- **API**: Axios with automatic token handling

## Security

- Tokens are stored in httpOnly cookies (when possible)
- Automatic logout on 401 responses
- Protected routes require authentication
- Environment variables for configuration

## Browser Support

- Chrome/Edge 90+
- Firefox 85+
- Safari 14+
- Modern mobile browsers

## Performance

- Virtualized spreadsheet grid for large datasets
- Debounced auto-saving to reduce API calls
- Lazy loading of components
- Optimized React rendering with proper memoization