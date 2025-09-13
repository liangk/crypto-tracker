import { useEffect, useRef } from 'react';
import { fetchTickers } from '../utils/api';
import type { ICoin, ITicker } from '../types';

export const usePolling = (coins: ICoin[], setCoins: React.Dispatch<React.SetStateAction<ICoin[]>>, interval: number = 30000): void => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(async () => {
      try {
        const tickerRes: ITicker[] = await fetchTickers();
        const tickerMap: Map<string, ITicker> = new Map(tickerRes.map((t: ITicker) => [t.id, t]));
        setCoins((prevCoins: ICoin[]) =>
          prevCoins.map((coin: ICoin) => {
            const ticker = tickerMap.get(coin.id);
            return {
              ...coin,
              price: ticker?.price || 0,
              change: ticker?.percent_change_24h || 0,
              volume: ticker?.total_volume || 0,
              percent_change_24h: ticker?.percent_change_24h || 0,
              market_cap: ticker?.market_cap || 0
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
  }, [coins, setCoins, interval]);
};