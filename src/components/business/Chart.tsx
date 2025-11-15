import { useEffect, useRef } from 'react';
import { createChart, ColorType, AreaSeries } from 'lightweight-charts';
import type { IChartApi } from 'lightweight-charts';

interface LightweightChartProps {
  data: Array<{
    timestamp: number;
    price: number;
    symbol: string;
  }>;
  symbol: string;
  height?: number;
}

export function Chart({ data, symbol, height = 300 }: LightweightChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'white' },
        textColor: '#6b7280',
      },
      grid: {
        vertLines: { color: '#f3f4f6' },
        horzLines: { color: '#f3f4f6' },
      },
      width: chartContainerRef.current.clientWidth,
      height: height,
      timeScale: {
        timeVisible: true,
        secondsVisible: true,
        borderColor: '#e5e7eb',
      },
      rightPriceScale: {
        borderColor: '#e5e7eb',
      },
    });

    const areaSeries = chart.addSeries(AreaSeries, {
      lineColor: '#2563eb',
      topColor: 'rgba(37, 99, 235, 0.3)',
      bottomColor: 'rgba(37, 99, 235, 0.05)',
      lineWidth: 2,
    });

    chartRef.current = chart;

    // Setup resize observer
    resizeObserverRef.current = new ResizeObserver((entries) => {
      if (entries.length === 0 || !chartRef.current) return;
      const { width, height: newHeight } = entries[0].contentRect;
      chartRef.current.applyOptions({ width, height: newHeight });
    });

    resizeObserverRef.current.observe(chartContainerRef.current);

    // Update data
    const chartData = data
      .filter((d) => d.symbol === symbol)
      .map((d) => ({
        time: Math.floor(d.timestamp / 1000) as never,
        value: d.price,
      }))
      .sort((a, b) => a.time - b.time);

    if (chartData.length > 0) {
      areaSeries.setData(chartData as never);
      chart.timeScale().fitContent();
    }

    return () => {
      resizeObserverRef.current?.disconnect();
      chart.remove();
    };
  }, [data, symbol, height]);

  const filteredData = data.filter((d) => d.symbol === symbol);

  if (filteredData.length === 0) {
    return (
      <div
        className='w-full flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200'
        style={{ height: `${height}px` }}
      >
        <p className='text-gray-500'>Waiting for price data...</p>
      </div>
    );
  }

  return <div ref={chartContainerRef} style={{ height: `${height}px` }} />;
}
