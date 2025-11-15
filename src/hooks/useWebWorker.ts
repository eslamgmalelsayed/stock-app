import { useEffect, useRef, useCallback } from 'react';

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

export function useWebWorker() {
  const workerRef = useRef<Worker | null>(null);
  const pendingRef = useRef<Map<string, PendingCallback>>(new Map());
  const messageIdRef = useRef(0);

  // Initialize worker
  useEffect(() => {
    try {
      workerRef.current = new Worker(
        new URL('../workers/stockDataWorker.ts', import.meta.url),
        { type: 'module' },
      );

      // Handle messages from worker
      workerRef.current.onmessage = (event: MessageEvent<WorkerMessage>) => {
        const { type, data, error, success } = event.data;
        const messageId = type.split('_').slice(0, -1).join('_');

        const pending = pendingRef.current.get(messageId);
        if (pending) {
          if (success) {
            pending.resolve(data);
          } else {
            pending.reject(new Error(error || 'Worker error'));
          }
          pendingRef.current.delete(messageId);
        }
      };

      // Handle worker errors
      workerRef.current.onerror = (error) => {
        console.error('Web Worker error:', error);
        // Reject all pending messages
        pendingRef.current.forEach(({ reject }) => {
          reject(new Error(error.message || 'Worker error'));
        });
        pendingRef.current.clear();
      };
    } catch (error) {
      console.error('Failed to create Web Worker:', error);
    }

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  // Send message to worker
  const send = useCallback(<T>(type: string, data?: unknown): Promise<T> => {
    return new Promise((resolve, reject) => {
      if (!workerRef.current) {
        reject(new Error('Web Worker not initialized'));
        return;
      }

      const messageId = `${type}_${messageIdRef.current++}`;
      pendingRef.current.set(messageId, { resolve, reject });

      try {
        workerRef.current.postMessage({ type, data });
      } catch (error) {
        pendingRef.current.delete(messageId);
        reject(error);
      }
    });
  }, []);

  return {
    send,
    isSupported: typeof Worker !== 'undefined',
  };
}
