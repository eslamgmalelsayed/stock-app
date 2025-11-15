import { useWebSocket } from '@/hooks/useWebSocket';
import { useWebWorker } from '@/hooks/useWebWorker';
import { usePriceHistory } from '@/hooks/usePriceHistory';
import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { Chart } from '@/components/business/Chart';

export default function Home() {
  // Data
  const baseUrl = import.meta.env.VITE_BASE_URL || 'baseUrl not found';
  const apiKey = import.meta.env.VITE_API_KEY || 'apiKey not found';
  const symbols = useMemo(
    () => ['AAPL', 'TRP', 'QQQ', 'EUR/USD', 'USD/JPY', 'BTC/USD', 'ETH/BTC'],
    [],
  );

  // State
  const [currentPage, setCurrentPage] = useState(1);
  const [stockDataMap, setStockDataMap] = useState<
    Record<string, Record<string, unknown>>
  >({});

  // Price History
  const { history: priceHistory, addPrice } = usePriceHistory();

  // Web Worker
  const { send: sendToWorker } = useWebWorker();

  // WebSocket
  const { send, isConnected } = useWebSocket({
    url: `${baseUrl}/quotes/price?apikey=${apiKey}`,
    onMessage: (data) => {
      const eventType = (data as Record<string, unknown>).event as string;
      if (eventType !== 'subscribe') {
        const symbol = (data as Record<string, unknown>).symbol as string;
        const price = ((data as Record<string, unknown>).price ||
          (data as Record<string, unknown>).last) as number;

        // Update stock data
        setStockDataMap((prev) => ({
          ...prev,
          [symbol]: data as Record<string, unknown>,
        }));

        // Add to price history
        if (price && symbol) {
          addPrice(symbol, price);
        }
      }
    },
    onError: (err) => {
      console.error('WebSocket error:', err);
    },
    onOpen: () => {
      send({
        action: 'subscribe',
        params: {
          symbols: symbols.join(','),
        },
      });
    },
    onClose: () => {
      console.log('WebSocket disconnected');
    },
    reconnect: true,
    reconnectInterval: 3000,
    maxReconnectAttempts: 5,
  });

  // Subscribe on connection
  useEffect(() => {
    if (isConnected && symbols.length > 0) {
      send({
        action: 'subscribe',
        params: {
          symbols: symbols.join(','),
        },
      });
    }
  }, [isConnected, send, symbols]);

  // Process stock data with worker
  useEffect(() => {
    Object.entries(stockDataMap).forEach(([symbol, data]) => {
      sendToWorker('PROCESS_STOCK', { symbol, ...data }).catch((error) => {
        console.error(`Failed to process ${symbol}:`, error);
      });
    });
  }, [stockDataMap, sendToWorker]);

  // Pagination calculations
  const totalPages = 1;

  // Event handlers
  const handlePreviousPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  }, [totalPages]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // Get BTC/USD data
  const btcData = stockDataMap['BTC/USD'] || {};
  const isLoading = !isConnected || Object.keys(btcData).length === 0;

  // UI
  return (
    <div className='p-6 max-w-6xl mx-auto'>
      <h1 className='text-3xl font-bold mb-2'>
        ₿ Real-time Bitcoin price via WebSocket
      </h1>

      <div className='mb-6 p-4 bg-green-50 rounded-lg border border-green-200'>
        <p
          className={
            isConnected ? 'text-sm text-green-700' : 'text-sm text-red-700'
          }
        >
          <strong>Status:</strong>{' '}
          {isConnected ? '✓ Connected' : '✗ Connecting...'}
        </p>
      </div>

      <div className='mb-6'>
        {isLoading ? (
          <Skeleton className='h-40 w-full rounded-lg' />
        ) : (
          <div className='bg-white p-8 rounded-lg border border-gray-200 shadow-sm'>
            <h2 className='text-lg font-semibold text-gray-700 mb-2'>
              {(btcData.type as string) || (btcData.currency_base as string)}
            </h2>
            <p className='text-5xl font-bold text-blue-600 mb-6'>
              $
              {((btcData.price as number) || (btcData.last as number))?.toFixed(
                2,
              )}
            </p>
            <div className='mt-6 pt-6 border-t border-gray-200'>
              <h3 className='text-sm font-semibold text-gray-600 mb-4'>
                Price Chart
              </h3>
              <Chart data={priceHistory} symbol='BTC/USD' height={200} />
            </div>
          </div>
        )}

        {/* Pagination Controls */}
        <Pagination className='mt-8'>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href='#'
                onClick={(e) => {
                  e.preventDefault();
                  handlePreviousPage();
                }}
                className={
                  currentPage === 1 ? 'pointer-events-none opacity-50' : ''
                }
              />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  href='#'
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(page);
                  }}
                  isActive={currentPage === page}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                href='#'
                onClick={(e) => {
                  e.preventDefault();
                  handleNextPage();
                }}
                className={
                  currentPage === totalPages
                    ? 'pointer-events-none opacity-50'
                    : ''
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>

        <p className='text-center text-sm text-gray-600 mt-4'>
          Page {currentPage} of {totalPages}
        </p>
      </div>
    </div>
  );
}
