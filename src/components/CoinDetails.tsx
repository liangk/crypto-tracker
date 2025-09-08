import { type FC, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeftIcon, StarIcon } from '@heroicons/react/24/outline';
import { fetchTicker, fetchHistorical } from '../utils/api';
import { formatPrice, formatPercent, getChangeColor } from '../utils/helpers';
import LoadingSpinner from './common/LoadingSpinner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { IDetailsProps, ITicker, IHistoricalDataPoint, IHistoricalChart } from '../types';

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
              price: h.quote.USD.close,
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
  if (error) return <div className="text-center text-cryptoRed">Error: {error}</div>;
  if (!coin) return <div className="text-center">Coin not found</div>;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md max-w-4xl mx-auto">
      <Link to="/" className="flex items-center text-primary hover:underline mb-4">
        <ArrowLeftIcon className="h-5 w-5 mr-1" aria-hidden="true" /> Back to Dashboard
      </Link>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">{coin.name} ({coin.symbol.toUpperCase()})</h1>
        <button onClick={() => id && toggleFavorite(id)} aria-label={`Toggle favorite for ${coin.name}`}>
          <StarIcon className={`h-6 w-6 ${isFavorite ? 'text-yellow-400 fill-current' : 'text-gray-400'}`} />
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-2xl font-semibold">{formatPrice(coin.quotes?.USD?.price)}</p>
          <p className={`${getChangeColor(coin.quotes?.USD?.percent_change_24h)} text-lg font-semibold`}>
            {formatPercent(coin.quotes?.USD?.percent_change_24h)}
          </p>
          <p>Market Cap: {formatPrice(coin.quotes?.USD?.market_cap)}</p>
          <p>Volume 24h: {formatPrice(coin.quotes?.USD?.volume_24h)}</p>
        </div>
      </div>
      <h2 className="text-xl font-bold mb-4">Price History (Last Month)</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={historical}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="price" stroke="#8884d8" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CoinDetails;