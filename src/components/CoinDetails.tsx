import { type FC, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeftIcon, StarIcon } from '@heroicons/react/24/outline';
import { fetchTicker, fetchHistorical } from '../utils/api';
import { formatPrice, formatPercent } from '../utils/helpers';
import LoadingSpinner from './common/LoadingSpinner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { IDetailsProps, ITicker, IHistoricalDataPoint, IHistoricalChart } from '../types';
import './CoinDetails.scss';

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
  if (error) return <div className="error">Error: {error}</div>;
  if (!coin) return <div className="coinNotFound">Coin not found</div>;

  const priceChange = coin.percent_change_24h ?? 0;
  const priceChangeClass = priceChange >= 0 ? 'positive' : 'negative';

  return (
    <div className="container">
      <Link to="/" className="backLink">
        <ArrowLeftIcon className="backIcon" aria-hidden="true" />
        Back to Dashboard
      </Link>
      
      <div className="tableHeader">
        <h1 className="coinTitle">
          {coin.name} ({coin.symbol.toUpperCase()})
        </h1>
        <button 
          onClick={() => id && toggleFavorite(id)} 
          className={`favoriteButton ${isFavorite ? 'favorite' : ''}`}
          aria-label={`${isFavorite ? 'Remove from' : 'Add to'} favorites: ${coin.name}`}
        >
          <StarIcon />
        </button>
      </div>

      <div className="priceSection">  
        <p className="price">{formatPrice(coin.price)}</p>
        <p className={`priceChange ${priceChangeClass}`}>
          {formatPercent(priceChange)} (24h)
        </p>
      </div>

      <div className="statsGrid">
        <div className="statItem">
          <div className="statLabel">Market Cap</div>
          <div className="statValue">
            {formatPrice(coin.market_cap)}
          </div>
        </div>
        <div className="statItem">
          <div className="statLabel">Volume (24h)</div>
          <div className="statValue">
            {formatPrice(coin.total_volume)}
          </div>
        </div>
        <div className="statItem">
          <div className="statLabel">Circulating Supply</div>
          <div className="statValue">
            {coin.circulating_supply.toLocaleString()} {coin.symbol.toUpperCase()}
          </div>
        </div>
        <div className="statItem">
          <div className="statLabel">Total Supply</div>
          <div className="statValue">
            {coin.total_supply.toLocaleString()} {coin.symbol.toUpperCase()}
          </div>
        </div>
      </div>

      <div className="chartContainer">
        <h2 className="chartTitle">Price History (Last Month)</h2>
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