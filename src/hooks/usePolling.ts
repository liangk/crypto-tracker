import { useEffect, useRef } from 'react';
import { fetchTickers } from '../utils/api';
import type { ICoin, ITicker } from '../types';

export const usePolling = (coins: ICoin[], setCoins: React.Dispatch<React.SetStateAction<ICoin[]>>, interval: number = 30000): void => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const coinsRef = useRef<ICoin[]>(coins);

  // Keep latest coins in a ref without resetting the timer
  useEffect(() => {
    coinsRef.current = coins;
  }, [coins]);

  // Start polling on mount or when interval changes
  useEffect(() => {
    intervalRef.current = setInterval(async () => {
      try {
        const perPage = Math.min(250, Math.max(1, coinsRef.current.length || 50));
        const tickerRes: ITicker[] = await fetchTickers(perPage, 1);
        const tickerMap: Map<string, ITicker> = new Map(tickerRes.map((t: ITicker) => [t.id, t]));
        setCoins((prevCoins: ICoin[]) =>
          prevCoins.map((coin: ICoin) => {
            const ticker = tickerMap.get(coin.id);
            return {
              ...coin,
              price: ticker?.price ?? coin.price,
              change: ticker?.percent_change_24h ?? coin.change,
              volume: ticker?.total_volume ?? coin.volume,
              percent_change_24h: ticker?.percent_change_24h ?? coin.percent_change_24h,
              market_cap: ticker?.market_cap ?? coin.market_cap
            };
          })
        );
      } catch (error: unknown) {
        console.error('Polling error:', error);
      }
    }, interval);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [interval, setCoins]);
};