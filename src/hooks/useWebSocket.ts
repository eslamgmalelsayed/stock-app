import { useEffect, useRef, useState, useCallback } from 'react';
import type { UseWebSocketOptions, UseWebSocketReturn } from '@/interfaces';

/**
 * Custom hook for WebSocket connections with automatic reconnection and error handling
 * @param options - WebSocket configuration options
 * @returns Object with connection state and control methods
 *
 * @example
 * const { isConnected, send, error } = useWebSocket({
 *   url: 'wss://api.example.com/stream',
 *   onMessage: (data) => console.log('Received:', data),
 *   reconnect: true,
 *   maxReconnectAttempts: 5
 * });
 */

export function useWebSocket({
  url,
  onMessage,
  onError,
  onOpen,
  onClose,
  reconnect = true,
  reconnectInterval = 3000,
  maxReconnectAttempts = 5,
}: UseWebSocketOptions): UseWebSocketReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const shouldReconnectRef = useRef(reconnect);
  const connectRef = useRef<(() => void) | null>(null);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const ws = new WebSocket(url);

      ws.addEventListener('open', () => {
        setIsConnected(true);
        setIsLoading(false);
        reconnectAttemptsRef.current = 0;
        setError(null);
        onOpen?.();
      });

      ws.addEventListener('message', (event) => {
        try {
          const data = JSON.parse(event.data);
          onMessage?.(data);
        } catch {
          onMessage?.(event.data);
        }
      });

      ws.addEventListener('error', (event) => {
        const err = new Error('WebSocket error occurred');
        setError(err);
        setIsLoading(false);
        onError?.(event);
      });

      ws.addEventListener('close', () => {
        setIsConnected(false);
        setIsLoading(false);
        onClose?.();

        if (
          shouldReconnectRef.current &&
          reconnectAttemptsRef.current < maxReconnectAttempts
        ) {
          reconnectAttemptsRef.current += 1;
          reconnectTimeoutRef.current = setTimeout(() => {
            connectRef.current?.();
          }, reconnectInterval);
        }
      });

      wsRef.current = ws;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      setIsLoading(false);
    }
  }, [
    url,
    reconnectInterval,
    maxReconnectAttempts,
    onMessage,
    onError,
    onOpen,
    onClose,
  ]);

  useEffect(() => {
    connectRef.current = connect;
  }, [connect]);

  const send = useCallback((data: unknown) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        typeof data === 'string' ? data : JSON.stringify(data),
      );
    } else {
      console.warn('WebSocket is not connected');
    }
  }, []);

  const close = useCallback(() => {
    shouldReconnectRef.current = false;
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    wsRef.current?.close();
  }, []);

  useEffect(() => {
    connectRef.current?.();

    return () => {
      close();
    };
  }, [close]);

  return {
    isConnected,
    isLoading,
    error,
    send,
    close,
  };
}
