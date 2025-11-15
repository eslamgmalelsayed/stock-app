interface UseWebSocketOptions {
  url: string;
  onMessage?: (data: unknown) => void;
  onError?: (error: Event) => void;
  onOpen?: () => void;
  onClose?: () => void;
  reconnect?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

interface UseWebSocketReturn {
  isConnected: boolean;
  isLoading: boolean;
  error: Error | null;
  send: (data: unknown) => void;
  close: () => void;
}

interface StockData {
  symbol: string;
  price: number;
  lastPrice?: number;
  bid?: number;
  ask?: number;
  timestamp?: number;
}

interface ProcessedStockData extends StockData {
  change: number;
  changePercent: number;
  spread: number;
}

export type {
  UseWebSocketOptions,
  UseWebSocketReturn,
  StockData,
  ProcessedStockData,
};
