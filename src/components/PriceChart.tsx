import { useEffect, useRef } from 'react';
import { createChart, ColorType, type IChartApi, type ISeriesApi } from 'lightweight-charts';
import type { CandleData } from '../types';

interface PriceChartProps {
  data: CandleData[];
  height?: number;
}

export default function PriceChart({ data, height = 400 }: PriceChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#6B7A9F',
        fontFamily: "'Inter', sans-serif",
        fontSize: 11,
      },
      grid: {
        vertLines: { color: '#E4EAFF' },
        horzLines: { color: '#E4EAFF' },
      },
      crosshair: {
        mode: 0,
        vertLine: { color: '#1652F0', width: 1, style: 2, labelBackgroundColor: '#1652F0' },
        horzLine: { color: '#1652F0', width: 1, style: 2, labelBackgroundColor: '#1652F0' },
      },
      width: chartContainerRef.current.clientWidth,
      height,
      rightPriceScale: {
        borderColor: '#E4EAFF',
        scaleMargins: { top: 0.1, bottom: 0.1 },
      },
      timeScale: {
        borderColor: '#E4EAFF',
        timeVisible: true,
        secondsVisible: false,
      },
      handleScroll: { vertTouchDrag: false },
    });

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#00C087',
      downColor: '#FF4747',
      borderDownColor: '#FF4747',
      borderUpColor: '#00C087',
      wickDownColor: '#FF4747',
      wickUpColor: '#00C087',
    });

    const formattedData = data.map(d => ({
      time: d.time as any,
      open: d.open,
      high: d.high,
      low: d.low,
      close: d.close,
    }));

    candlestickSeries.setData(formattedData);
    chart.timeScale().fitContent();

    chartRef.current = chart;
    seriesRef.current = candlestickSeries;

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [data, height]);

  return (
    <div className="relative rounded-xl overflow-hidden bg-white border border-ww-border p-1">
      <div ref={chartContainerRef} className="w-full" />
    </div>
  );
}
