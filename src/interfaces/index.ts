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

interface PendingCallback {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resolve: (value: any) => void;
  reject: (error: Error) => void;
}

interface WorkerMessage {
  type: string;
  data?: unknown;
  error?: string;
  success: boolean;
}

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

export type {
  UseWebSocketOptions,
  UseWebSocketReturn,
  StockData,
  ProcessedStockData,
  PendingCallback,
  WorkerMessage,
  HistoryPoint,
  UsePriceHistoryReturn,
};
