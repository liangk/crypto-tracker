import { type FC, memo } from 'react';
import { Link } from 'react-router-dom';
import { StarIcon } from '@heroicons/react/24/outline';
import type { ICoin } from '../types';
import { formatPrice, formatPercent } from '../utils/helpers';
import type { IToggleFavoriteProps } from '../types';
import styles from './CoinTable.module.css';

interface ICoinRowProps {
  coin: ICoin;
  isFavorite: boolean;
  toggleFavorite: (coinId: string) => void;
}

const CoinRow: FC<ICoinRowProps> = memo(({ coin, isFavorite, toggleFavorite }) => {
  const changeClass = (coin.quotes?.USD?.percent_change_24h ?? 0) >= 0 ? styles.positiveChange : styles.negativeChange;
  
  return (
    <tr className={styles.coinRow}>
      <td>
        <div className={styles.coinNameCell}>
          <button 
            onClick={() => toggleFavorite(coin.id)} 
            className={`${styles.favoriteButton} ${isFavorite ? styles.favorite : ''}`}
            aria-label={`${isFavorite ? 'Remove from' : 'Add to'} favorites: ${coin.name}`}
          >
            <StarIcon className={`h-5 w-5 ${isFavorite ? 'text-yellow-400 fill-current' : 'text-gray-400'}`} />
          </button>
          <Link to={`/coin/${coin.id}`} className={styles.coinLink}>
            <span className={styles.coinName}>{coin.name}</span>
            <span className={styles.coinSymbol}> {coin.symbol.toUpperCase()}</span>
          </Link>
        </div>
      </td>
      <td className={styles.priceCell}>{formatPrice(coin.price)}</td>
      <td className={`${styles.priceCell} ${changeClass}`}>
        {formatPercent(coin.quotes?.USD?.percent_change_24h ?? 0)}
      </td>
      <td className={styles.priceCell}>{formatPrice(coin.volume)}</td>
    </tr>
  );
});

CoinRow.displayName = 'CoinRow';

interface ICoinTableProps extends IToggleFavoriteProps {
  coins: ICoin[];
  favorites: string[];
}

const CoinTable: FC<ICoinTableProps> = ({ coins, favorites, toggleFavorite }) => (
  <div className={styles.tableWrapper}>
    <table className={styles.coinTable}>
      <thead className={styles.tableHead}>
        <tr>
          <th className={styles.tableHeader}>Coin</th>
          <th className={styles.tableHeader}>Price (USD)</th>
          <th className={styles.tableHeader}>24h Change</th>
          <th className={styles.tableHeader}>Volume 24h</th>
        </tr>
      </thead>
      <tbody>
        {coins.length > 0 ? (
          coins.map((coin) => (
            <CoinRow
              key={coin.id}
              coin={coin}
              isFavorite={favorites.includes(coin.id)}
              toggleFavorite={toggleFavorite}
            />
          ))
        ) : (
          <tr>
            <td colSpan={4} className={styles.noResults}>
              No coins found. Try adjusting your search.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

export default CoinTable;