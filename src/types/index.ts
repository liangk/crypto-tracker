export interface ICoinBase {
  id: string;
  name: string;
  symbol: string;
}

export interface IQuoteUSD {
  price: number;
  percent_change_24h: number;
  volume_24h: number;
  market_cap: number;
}

export interface ITicker extends ICoinBase {
  quotes: {
    USD: IQuoteUSD;
  };
  circulating_supply: number;
  total_supply: number;
  max_supply: number | null;
}

export interface IHistoricalDataPoint {
  time_close: number;
  quote: {
    USD: {
      close: number;
    };
  };
}

export interface IHistoricalChart {
  date: string;
  price: number;
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
  quotes: {
    USD: {
      price: number;
      percent_change_24h: number;
      volume_24h: number;
      market_cap: number;
    };
  };
}

export interface ICoinsHook {
  coins: ICoin[];
  loading: boolean;
  error: string | null;
}