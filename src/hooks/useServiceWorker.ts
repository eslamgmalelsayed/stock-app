import { useEffect, useState } from 'react';

const isSupported = 'serviceWorker' in navigator;

export function useServiceWorker() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!isSupported) return;

    navigator.serviceWorker.ready
      .then(() => {
        setIsReady(true);
        console.log('Service Worker is ready');
      })
      .catch((err) => {
        console.error('Service Worker ready check failed:', err);
      });
  }, []);

  const processInWorker = (type: string, data: unknown) => {
    return new Promise((resolve, reject) => {
      if (!isReady) {
        reject(new Error('Service Worker not ready'));
        return;
      }

      const channel = new MessageChannel();
      const worker = navigator.serviceWorker.controller;

      if (!worker) {
        reject(new Error('No active Service Worker'));
        return;
      }

      channel.port1.onmessage = (event) => {
        resolve(event.data);
      };

      worker.postMessage(
        {
          type,
          data,
        },
        [channel.port2],
      );
    });
  };

  return {
    isSupported,
    isReady,
    processInWorker,
  };
}
