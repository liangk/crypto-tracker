// import type { ICoin } from '../types';

export const formatPrice = (price: number | undefined): string => (price ? `$${Number(price).toLocaleString()}` : 'N/A');

export const formatPercent = (percent: number | undefined): string => (percent ? `${percent.toFixed(2)}%` : 'N/A');

export const getChangeColor = (change: number | undefined): string => (change && change > 0 ? 'text-cryptoGreen' : 'text-cryptoRed');

export const isFavorite = (favorites: string[], coinId: string): boolean => favorites.includes(coinId);