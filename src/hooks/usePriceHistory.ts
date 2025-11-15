import { useCallback, useRef, useState } from 'react';

interface HistoryPoint {
  timestamp: number;
  price: number;
  symbol: string;
}

interface UsePriceHistoryReturn {
  history: HistoryPoint[];
  addPrice: (symbol: string, price: number) => void;
  clearHistory: () => void;
}

const MAX_HISTORY_POINTS = 60;
const HISTORY_INTERVAL = 1000;

export function usePriceHistory(): UsePriceHistoryReturn {
  const [history, setHistory] = useState<HistoryPoint[]>([]);
  const lastPricesRef = useRef<Record<string, number>>({});
  const lastUpdateRef = useRef<Record<string, number>>({});

  const addPrice = useCallback((symbol: string, price: number) => {
    const now = Date.now();
    const lastUpdate = lastUpdateRef.current[symbol] || 0;

    if (now - lastUpdate < HISTORY_INTERVAL) {
      lastPricesRef.current[symbol] = price;
      return;
    }

    lastPricesRef.current[symbol] = price;
    lastUpdateRef.current[symbol] = now;

    setHistory((prev) => {
      const filtered = prev.filter((p) => p.symbol === symbol);
      const newPoint: HistoryPoint = {
        timestamp: now,
        price,
        symbol,
      };

      const updated = [...filtered, newPoint];

      if (updated.length > MAX_HISTORY_POINTS) {
        return updated.slice(updated.length - MAX_HISTORY_POINTS);
      }

      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    lastPricesRef.current = {};
    lastUpdateRef.current = {};
  }, []);

  return { history, addPrice, clearHistory };
}
