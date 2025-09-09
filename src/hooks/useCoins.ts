import { useState, useEffect } from 'react';
import { fetchCoins, fetchTickers } from '../utils/api';
import type { ICoin, ICoinsHook, ITicker, ICoinBase } from '../types';

export const useCoins = (initialLimit: number = 20): ICoinsHook => {
  const [coins, setCoins] = useState<ICoin[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);
        const [coinRes, tickerRes] = await Promise.all([fetchCoins(100), fetchTickers()]);
        const tickerMap: Map<string, ITicker> = new Map(tickerRes.map((t: ITicker) => [t.id, t]));
        const enrichedCoins: ICoin[] = coinRes
          .slice(0, initialLimit)
          .map((coin: ICoinBase) => {
            const ticker = tickerMap.get(coin.id);
            return {
              ...coin,
              price: ticker?.quotes?.USD?.price || 0,
              change: ticker?.quotes?.USD?.percent_change_24h || 0,
              volume: ticker?.quotes?.USD?.volume_24h || 0,
              quotes: ticker?.quotes || {
                USD: {
                  price: ticker?.quotes?.USD?.price || 0,
                  percent_change_24h: ticker?.quotes?.USD?.percent_change_24h || 0,
                  volume_24h: ticker?.quotes?.USD?.volume_24h || 0,
                  market_cap: ticker?.quotes?.USD?.market_cap || 0
                }
              }
            };
          });
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