export interface ICoinBase {
  id: string;
  name: string;
  symbol: string;
}

export interface IAppState {
  favorites: string[];
  darkMode: boolean;
}

export interface IFavoritesProps {
  favorites: string[];
  toggleFavorite: (coinId: string) => void;
}

export interface IToggleFavoriteProps {
  toggleFavorite: (coinId: string) => void;
}

export interface IDashboardProps extends IToggleFavoriteProps {
  favorites: string[];
}

export interface IDetailsProps extends IToggleFavoriteProps {
  favorites: string[];
}

export interface ICoin extends ICoinBase {
  price: number;
  change: number;
  volume: number;
  percent_change_24h: number;
  market_cap: number;
}

export interface ICoinsHook {
  coins: ICoin[];
  loading: boolean;
  error: string | null;
}

export interface IQuoteUSD {
  price: number;
  percent_change_24h: number;
  volume_24h: number;
  market_cap: number;
}

export interface ITicker extends ICoinBase {
  circulating_supply: number;
  total_supply: number;
  max_supply: number | null;
  price: number;
  percent_change_24h: number;
  total_volume: number;
  market_cap: number;
}

// Define the shape of the API response item
export interface ICoinMarketData {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number | null;
  total_volume: number;
  market_cap: number;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
}

// For historical: CoinGecko uses arrays, but map to match old shape
export interface IHistoricalDataPoint {
  time_close: number;  // Unix timestamp
  close: number;  // Price
}

export interface IHistoricalChart {
  date: string;
  price: number;
}

// New: For CoinGecko-specific responses (optional, for direct access if needed)
export interface ICoinGeckoMarket {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h?: number;
  total_volume: number;
  market_cap: number;
}