// Web Worker for heavy stock data processing

import type { StockData, ProcessedStockData } from '@/interfaces';

// Process stock data with calculations
function processStockData(data: StockData): ProcessedStockData {
  const currentPrice = data.price || 0;
  const lastPrice = data.lastPrice || currentPrice;
  const bid = data.bid || currentPrice;
  const ask = data.ask || currentPrice;

  const change = currentPrice - lastPrice;
  const changePercent = lastPrice !== 0 ? (change / lastPrice) * 100 : 0;
  const spread = ask - bid;

  return {
    ...data,
    change: Math.round(change * 100) / 100,
    changePercent: Math.round(changePercent * 100) / 100,
    spread: Math.round(spread * 10000) / 10000,
  };
}

// Calculate statistics for multiple stocks
function calculateStatistics(dataMap: Record<string, StockData>) {
  const prices = Object.values(dataMap)
    .map((d) => d.price || 0)
    .filter((p) => p > 0);

  if (prices.length === 0) {
    return {
      avgPrice: 0,
      maxPrice: 0,
      minPrice: 0,
      totalValue: 0,
    };
  }

  const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
  const maxPrice = Math.max(...prices);
  const minPrice = Math.min(...prices);
  const totalValue = prices.reduce((a, b) => a + b, 0);

  return {
    avgPrice: Math.round(avgPrice * 100) / 100,
    maxPrice: Math.round(maxPrice * 100) / 100,
    minPrice: Math.round(minPrice * 100) / 100,
    totalValue: Math.round(totalValue * 100) / 100,
  };
}

// Listen for messages from main thread
self.addEventListener('message', (event) => {
  const { type, data } = event.data;

  try {
    let result;

    if (type === 'PROCESS_STOCK') {
      result = processStockData(data);
    } else if (type === 'CALCULATE_STATS') {
      result = calculateStatistics(data);
    } else {
      throw new Error(`Unknown message type: ${type}`);
    }

    self.postMessage({
      type: `${type}_RESULT`,
      data: result,
      success: true,
    });
  } catch (error) {
    self.postMessage({
      type: `${type}_ERROR`,
      error: error instanceof Error ? error.message : 'Unknown error',
      success: false,
    });
  }
});
