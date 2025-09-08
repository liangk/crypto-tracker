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
          prevCoins.map((coin: ICoin) => ({
            ...coin,
            price: tickerMap.get(coin.id)?.quotes?.USD?.price,
            change: tickerMap.get(coin.id)?.quotes?.USD?.percent_change_24h,
          }))
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