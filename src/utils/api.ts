import axios, { type AxiosInstance } from 'axios';
import type { ICoinBase, ITicker, IHistoricalDataPoint, ICoinMarketData } from '../types';

const API_BASE = 'https://api.coingecko.com/api/v3';

const apiClient: AxiosInstance = axios.create({ baseURL: API_BASE });

export const fetchCoins = async (limit: number = 100): Promise<ICoinBase[]> => {
  try {
    // /coins/list returns [{ id: 'bitcoin', symbol: 'btc', name: 'Bitcoin' }, ...]
    const { data } = await apiClient.get<{ id: string; symbol: string; name: string; }[]>('/coins/list');
    return data.slice(0, limit).map(coin => ({ id: coin.id, name: coin.name, symbol: coin.symbol }));
  } catch (error: unknown) {
    console.error('Error fetching coins:', error);
    return [];
  }
};

export const fetchTickers = async (per_page: number = 20, page: number = 1): Promise<ITicker[]> => {
  // Use /simple/price for all coins (but limit to top 250 for perf; paginate if needed)
  // For full, call /coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250
  try {
    const { data } = await apiClient.get('/coins/markets', {
      params: { vs_currency: 'usd', order: 'market_cap_desc', per_page, page }
    });

    // Map to ITicker shape
    return (data as ICoinMarketData[]).map((item) => ({
      id: item.id,
      name: item.name,
      symbol: item.symbol,
      price: item.current_price,
      percent_change_24h: item.price_change_percentage_24h || 0,
      total_volume: item.total_volume,
      market_cap: item.market_cap,
      circulating_supply: item.circulating_supply,
      total_supply: item.total_supply || 0,
      max_supply: item.max_supply
    }));
  } catch (error: unknown) {
    console.error('Error fetching tickers:', error);
    return [];
  }
};

export const fetchTicker = async (coinId: string): Promise<ITicker | null> => {
  try {
    const { data } = await apiClient.get(`/coins/${coinId}`, {
      params: { localization: false, tickers: false, market_data: true, community_data: false, developer_data: false, sparkline: false }
    });
    // Map to ITicker (full details)
    return {
      id: data.id,
      name: data.name,
      symbol: data.symbol,
      price: data.market_data.current_price.usd,
      percent_change_24h: data.market_data.price_change_percentage_24h,
      total_volume: data.market_data.total_volume.usd,
      market_cap: data.market_data.market_cap.usd,
      circulating_supply: data.market_data.circulating_supply,
      total_supply: data.market_data.total_supply || 0,
      max_supply: data.market_data.max_supply
    };
  } catch (error: unknown) {
    console.error('Error fetching ticker:', error);
    return null;
  }
};

export const fetchHistorical = async (coinId: string, startDate: string = '2025-08-01'): Promise<IHistoricalDataPoint[]> => {
  try {
    // Convert startDate to Unix (seconds); end is now
    const from = Math.floor(new Date(startDate).getTime() / 1000);
    const to = Math.floor(Date.now() / 1000);
    const { data } = await apiClient.get(`/coins/${coinId}/market_chart/range`, {
      params: { vs_currency: 'usd', from, to, precision: 2 }
    });
    // Response: { prices: [[timestamp, price], ...], total_volumes: [[ts, vol], ...], market_caps: [[ts, cap], ...] }
    // Map prices to your IHistoricalDataPoint (adjust type below; use time_close as ts, close as price)
    return data.prices.map(([time_close, quote_USD_close]: [number, number]) => ({
      time_close,
      close: quote_USD_close
    }));
  } catch (error: unknown) {
    console.error('Error fetching historical data:', error);
    return [];
  }
};