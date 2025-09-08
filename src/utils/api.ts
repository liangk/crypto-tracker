import axios, { type AxiosInstance } from 'axios';
import { type ITicker, type IHistoricalDataPoint } from '../types';
import type { ICoinBase } from '../types';

const API_BASE = 'https://api.coinpaprika.com/v1';

const apiClient: AxiosInstance = axios.create({ baseURL: API_BASE, timeout: 10000 });

export const fetchCoins = async (limit: number = 100): Promise<ICoinBase[]> => {
  try {
    const { data } = await apiClient.get<ICoinBase[]>('/coins');
    return data.slice(0, limit);
  } catch (error: unknown) {
    console.error('Error fetching coins:', error);
    return [];
  }
};

export const fetchTickers = async (): Promise<ITicker[]> => {
  try {
    const { data } = await apiClient.get<ITicker[]>('/tickers');
    return data;
  } catch (error: unknown) {
    console.error('Error fetching tickers:', error);
    return [];
  }
};

export const fetchTicker = async (coinId: string): Promise<ITicker | null> => {
  try {
    const { data } = await apiClient.get<ITicker>(`/tickers/${coinId}`);
    return data;
  } catch (error: unknown) {
    console.error('Error fetching ticker:', error);
    return null;
  }
};

export const fetchHistorical = async (coinId: string, startDate: string = '2025-08-01'): Promise<IHistoricalDataPoint[]> => {
  try {
    const { data } = await apiClient.get<IHistoricalDataPoint[]>(`/coins/${coinId}/ohlcv/historical?start=${startDate}`);
    return data;
  } catch (error: unknown) {
    console.error('Error fetching historical data:', error);
    return [];
  }
};