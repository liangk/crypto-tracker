import { type FC, memo } from 'react';
import { Link } from 'react-router-dom';
import { StarIcon } from '@heroicons/react/24/outline';
import type { ICoin } from '../types';
import { formatPrice, formatPercent, getChangeColor } from '../utils/helpers';
import type { IToggleFavoriteProps } from '../types';

interface ICoinRowProps {
  coin: ICoin;
  isFavorite: boolean;
  toggleFavorite: (coinId: string) => void;
}

const CoinRow: FC<ICoinRowProps> = memo(({ coin, isFavorite, toggleFavorite }) => (
  <tr className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
    <td className="px-4 py-3">
      <div className="flex items-center">
        <button onClick={() => toggleFavorite(coin.id)} aria-label={`Toggle favorite for ${coin.name}`}>
          <StarIcon className={`h-5 w-5 ${isFavorite ? 'text-yellow-400 fill-current' : 'text-gray-400'}`} />
        </button>
        <Link to={`/coin/${coin.id}`} className="ml-2 font-medium hover:underline">
          {coin.name} ({coin.symbol})
        </Link>
      </div>
    </td>
    <td className="px-4 py-3">{formatPrice(coin.price)}</td>
    <td className={`px-4 py-3 ${getChangeColor(coin.change)} font-semibold`}>{formatPercent(coin.change)}</td>
    <td className="px-4 py-3">{formatPrice(coin.volume)}</td>
  </tr>
));

CoinRow.displayName = 'CoinRow';

interface ICoinTableProps extends IToggleFavoriteProps {
  coins: ICoin[];
  favorites: string[];
}

const CoinTable: FC<ICoinTableProps> = ({ coins, favorites, toggleFavorite }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md">
      <thead className="bg-gray-50 dark:bg-gray-700">
        <tr>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Coin</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Price (USD)</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">24h Change</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Volume 24h</th>
        </tr>
      </thead>
      <tbody>
        {coins.map((coin) => (
          <CoinRow
            key={coin.id}
            coin={coin}
            isFavorite={favorites.includes(coin.id)}
            toggleFavorite={toggleFavorite}
          />
        ))}
      </tbody>
    </table>
  </div>
);

export default CoinTable;