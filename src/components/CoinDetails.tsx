import { type FC, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeftIcon, StarIcon } from '@heroicons/react/24/outline';
import { fetchTicker, fetchHistorical } from '../utils/api';
import { formatPrice, formatPercent } from '../utils/helpers';
import LoadingSpinner from './common/LoadingSpinner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { IDetailsProps, ITicker, IHistoricalDataPoint, IHistoricalChart } from '../types';
import styles from './CoinDetails.module.css';

const CoinDetails: FC<IDetailsProps> = ({ favorites, toggleFavorite }) => {
  const { id } = useParams<{ id: string }>();
  const [coin, setCoin] = useState<ITicker | null>(null);
  const [historical, setHistorical] = useState<IHistoricalChart[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const isFavorite = favorites.includes(id || '');

  useEffect(() => {
    if (!id) return;
    const loadData = async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);
        const [ticker, hist] = await Promise.all([fetchTicker(id), fetchHistorical(id)]);
        setCoin(ticker);
        if (hist && hist.length > 0) {
          setHistorical(
            hist.map((h: IHistoricalDataPoint) => ({
              date: new Date(h.time_close).toLocaleDateString(),
              price: h.close,
            }))
          );
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className={styles.error}>Error: {error}</div>;
  if (!coin) return <div className={styles.coinNotFound}>Coin not found</div>;

  const priceChange = coin.percent_change_24h ?? 0;
  const priceChangeClass = priceChange >= 0 ? styles.positive : styles.negative;

  return (
    <div className={styles.container}>
      <Link to="/" className={styles.backLink}>
        <ArrowLeftIcon className={styles.backIcon} aria-hidden="true" />
        Back to Dashboard
      </Link>
      
      <div className={styles.header}>
        <h1 className={styles.coinTitle}>
          {coin.name} ({coin.symbol.toUpperCase()})
        </h1>
        <button 
          onClick={() => id && toggleFavorite(id)} 
          className={`${styles.favoriteButton} ${isFavorite ? styles.favorite : ''}`}
          aria-label={`${isFavorite ? 'Remove from' : 'Add to'} favorites: ${coin.name}`}
        >
          <StarIcon />
        </button>
      </div>

      <div className={styles.priceSection}>
        <p className={styles.price}>{formatPrice(coin.price)}</p>
        <p className={`${styles.priceChange} ${priceChangeClass}`}>
          {formatPercent(priceChange)} (24h)
        </p>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statItem}>
          <div className={styles.statLabel}>Market Cap</div>
          <div className={styles.statValue}>
            {formatPrice(coin.market_cap)}
          </div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statLabel}>Volume (24h)</div>
          <div className={styles.statValue}>
            {formatPrice(coin.total_volume)}
          </div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statLabel}>Circulating Supply</div>
          <div className={styles.statValue}>
            {coin.circulating_supply.toLocaleString()} {coin.symbol.toUpperCase()}
          </div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statLabel}>Total Supply</div>
          <div className={styles.statValue}>
            {coin.total_supply.toLocaleString()} {coin.symbol.toUpperCase()}
          </div>
        </div>
      </div>

      <div className={styles.chartContainer}>
        <h2 className={styles.chartTitle}>Price History (Last Month)</h2>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={historical}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="date" 
              stroke="#6b7280"
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              width={80}
              stroke="#6b7280"
              tickFormatter={(value) => `$${value}`}
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              formatter={(value) => [`$${value}`, 'Price']}
              labelFormatter={(label) => `Date: ${label}`}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '0.375rem',
                padding: '0.5rem',
                fontSize: '0.875rem',
              }}
              labelStyle={{ color: '#111827', fontWeight: 500 }}
              itemStyle={{ color: '#111827' }}
            />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke="#3b82f6" 
              strokeWidth={2} 
              dot={false} 
              activeDot={{ r: 6, strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CoinDetails;