import { type FC, useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeftIcon, StarIcon } from '@heroicons/react/24/outline';
import { fetchTicker, fetchHistorical } from '../utils/api';
import { formatPrice, formatPercent } from '../utils/helpers';
import LoadingSpinner from './common/LoadingSpinner';
import { LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line } from 'recharts';
import type { IDetailsProps, ITicker, IHistoricalDataPoint, IHistoricalChart } from '../types';
import './CoinDetails.scss';

const CoinDetails: FC<IDetailsProps> = ({ favorites, toggleFavorite }) => {
  const { id } = useParams<{ id: string }>();
  const [coin, setCoin] = useState<ITicker | null>(null);
  const [historical, setHistorical] = useState<IHistoricalChart[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const isFavorite = favorites.includes(id || '');

  const formatDate = (dateString: string | number | Date, options: { includeWeekday?: boolean; format?: 'dayMonth' | 'full' } = {}) => {
    const { includeWeekday = false, format = 'full' } = options;
    
    if (format === 'dayMonth') {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
    
    return new Date(dateString).toLocaleDateString('en-US', {
      ...(includeWeekday && { weekday: 'short' }),
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

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
              date: h.time_close,
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

  // Optimize historical data by sampling if too many points
  const optimizedHistoricalData = useMemo(() => {
    if (!historical || historical.length <= 100) return historical;
    
    const step = Math.ceil(historical.length / 100); // Target ~100 data points
    return historical.filter((_, index) => index % step === 0);
  }, [historical]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error">Error loading coin details: {error}</div>;
  if (!coin) return <div className="not-found">Coin not found</div>;

  // Debug log with data validation
  console.log('Historical data sample:', historical);

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
        <h3 className="chartTitle">Price History (Last 30 Days)</h3>
        {historical.length === 0 ? (
          <p>No historical data available</p>
        ) : (
          <div className="chartWrapper">
            <div className="dataRange">Data range: {formatDate(historical[0]?.date)} to {formatDate(historical[historical.length - 1]?.date)}</div>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={optimizedHistoricalData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(date) => formatDate(date, { format: 'dayMonth' })}
                  tick={{ fontSize: 11, fill: '#6b7280' }}
                  axisLine={false}
                  tickLine={false}
                  minTickGap={30}
                />
                <YAxis 
                  domain={['auto', 'auto']} 
                  tickFormatter={(value) => `$${value >= 1 ? value.toLocaleString(undefined, { maximumFractionDigits: 2 }) : value.toFixed(4)}`}
                  width={80}
                  tick={{ fontSize: 11, fill: '#6b7280' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{
                    background: 'rgba(255, 255, 255, 0.98)',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                  }}
                  formatter={(value: number) => [`$${value >= 1 ? value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : value.toFixed(6)}`, 'Price']}
                  labelFormatter={(label) => `Date: ${formatDate(label)}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={false}
                  isAnimationActive={false}
                  connectNulls={true}
                  activeDot={{ r: 6, stroke: '#2563eb', strokeWidth: 2, fill: '#3b82f6' }}
                />
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoinDetails;