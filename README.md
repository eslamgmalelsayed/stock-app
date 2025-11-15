# Stock App

A modern real-time stock price tracker built with React, TypeScript, and Vite. Displays live BTC/USD prices via WebSocket with Service Workers for offline support, Web Workers for background processing, and optimized performance (LCP: 0.69s).

## 🚀 Tech Stack

| Category          | Technology                                                |
| ----------------- | --------------------------------------------------------- |
| **Framework**     | React 19.2.0, React DOM 19.2.0                            |
| **Build Tool**    | Vite (rolldown-vite 7.2.2) with HMR                       |
| **Language**      | TypeScript 5.9.3 (strict mode)                            |
| **Styling**       | Tailwind CSS 4.1.17 with CSS Variables                    |
| **UI Components** | shadcn/ui (Radix UI primitives, Class Variance Authority) |
| **Icons**         | Lucide React 0.553.0                                      |
| **Real-time API** | TwelveData WebSocket (wss://ws.twelvedata.com/v1)         |
| **Code Quality**  | ESLint 9.39.1, Prettier 3.6.2, TypeScript-ESLint 8.46.3   |
| **Git Hooks**     | Husky 9.1.7 + lint-staged for pre-commit checks           |
| **Deployment**    | Netlify with Service Worker support                       |

## ✨ Key Features

- **Real-time WebSocket** - Single connection for all 7 symbols (AAPL, TRP, QQQ, EUR/USD, USD/JPY, BTC/USD, ETH/BTC)
- **Service Workers** - Network-first caching strategy with offline support
- **Web Workers** - Heavy stock data processing off main thread
- **Skeleton Loading** - Prevents layout shifts during data loading
- **Font Preloading** - Optimized LCP (0.69s) with Google Fonts
- **Pagination** - Navigate through symbols (3 per page)
- **TypeScript Strict Mode** - Full type safety across codebase

## 📁 Project Structure

```bash
stock-app/
├── src/
│ ├── components/
│ │ ├── business/
│ │ │ └── TradingView.tsx
│ │ └── ui/
│ │ ├── button.tsx
│ │ ├── button.variants.ts
│ │ ├── pagination.tsx
│ │ └── skeleton.tsx
│ ├── hooks/
│ │ ├── useWebSocket.ts      # WebSocket lifecycle management
│ │ ├── useWebWorker.ts      # Web Worker communication
│ │ └── useServiceWorker.ts  # Service Worker tasks
│ ├── workers/
│ │ └── stockDataWorker.ts   # Background data processing
│ ├── interfaces/
│ │ └── index.ts             # TypeScript interfaces
│ ├── lib/
│ │ └── utils.ts
│ ├── pages/
│ │ └── Home.tsx
│ ├── App.tsx
│ ├── main.tsx
│ ├── sw.ts                  # Service Worker (src/sw.ts)
│ └── index.css
├── public/
│ └── sw.js                  # Built Service Worker
├── netlify.toml             # Netlify deployment config
├── vite.config.ts
├── tsconfig.json
├── eslint.config.ts
├── components.json
└── package.json
```

## 🏗️ Architecture

### WebSocket Connection

Single shared WebSocket subscribes to all symbols, avoiding multiple connections overhead.

### Service Worker

- **Install**: Caches essential assets (/, index.html)
- **Fetch**: Network-first strategy with cache fallback
- **Messages**: Handles background processing tasks

### Web Worker

- Processes stock data calculations (price changes, statistics)
- Runs off main thread for better performance
- Communicates via MessageChannel

### Performance Optimizations

- Memoized pagination calculations
- useCallback for event handlers
- Single Web Worker instance
- Font preloading (Inter, weights 400-700)
- Skeleton loading prevents layout shifts (CLS: 0)

## 📊 Performance Metrics

- **LCP (Largest Contentful Paint)**: 0.69s ✅ (Good)
- **CLS (Cumulative Layout Shift)**: 0 (Skeleton prevents shifts)
- **Service Worker Support**: ✅ Offline-ready
- **Web Worker**: ✅ Background processing

## 🛠️ Getting Started

```bash
# Install dependencies
pnpm install

# Add .env.local with API credentials
echo 'VITE_BASE_URL=wss://ws.twelvedata.com/v1' > .env.local
echo 'VITE_API_KEY=your_api_key_here' >> .env.local

# Start development server
pnpm dev

# Build for production
pnpm build

# Deploy to Netlify
netlify deploy
```

## 📡 API Integration

Uses TwelveData WebSocket API for real-time stock prices:

```typescript
// Subscribe to multiple symbols
{
  "action": "subscribe",
  "params": {
    "symbols": "AAPL,BTC/USD,EUR/USD"
  }
}
```

## 🚀 Deployment

### Netlify

```bash
# One-click deployment
netlify deploy
```

Configuration via `netlify.toml`:

- Build: `pnpm run build`
- Publish: `dist/`
- SPA routing: All routes redirect to index.html
- Cache headers: Service Worker never cached, assets 1-year cache

## 📚 Learn More

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vite.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [Service Workers API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Web Workers API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)
- [TwelveData API](https://twelvedata.com/docs)
