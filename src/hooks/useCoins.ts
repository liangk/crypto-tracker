import { useState, useEffect } from 'react';
import { fetchTickers } from '../utils/api';
import type { ICoin, ICoinsHook, ITicker } from '../types';

export const useCoins = (initialLimit: number = 20): ICoinsHook => {
  const [coins, setCoins] = useState<ICoin[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);
        const tickerRes = await fetchTickers();
        const enrichedCoins: ICoin[] = tickerRes
          .slice(0, initialLimit)
          .map((coin: ITicker) => {
            return {
              ...coin,
              price: coin.price || 0,
              change: coin.percent_change_24h || 0,
              volume: coin.total_volume || 0,
              percent_change_24h: coin.percent_change_24h || 0,
              market_cap: coin.market_cap || 0
            };
          });
        console.log(enrichedCoins);
        setCoins(enrichedCoins);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [initialLimit]);

  return { coins, loading, error };
};