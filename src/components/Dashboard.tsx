import { type FC, useState } from 'react';
import { useCoins } from '../hooks/useCoins';
import { usePolling } from '../hooks/usePolling';
import LoadingSpinner from './common/LoadingSpinner';
import SearchBar from './SearchBar';
import CoinTable from './CoinTable';
import Favorites from './Favorites';
import type { ICoin } from '../types';
import type { IDashboardProps } from '../types';

const Dashboard: FC<IDashboardProps> = ({ favorites, toggleFavorite }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('market_cap_desc');
  const [filteredCoins, setFilteredCoins] = useState<ICoin[]>([]);
  const { coins: allCoins, loading, error } = useCoins(50);

  usePolling(allCoins, setFilteredCoins);

  const handleSearch = (query: string): void => {
    console.log(searchQuery);
    setSearchQuery(query);
    if (!query) {
      setFilteredCoins(allCoins);
    } else {
      const lowerQuery = query.toLowerCase();
      setFilteredCoins(
        allCoins.filter((coin: ICoin) =>
          coin.name.toLowerCase().includes(lowerQuery) || coin.symbol.toLowerCase().includes(lowerQuery)
        )
      );
    }
  };

  const handleSort = (key: string): void => {
    setSortBy(key);
    const sorted: ICoin[] = [...filteredCoins].sort((a: ICoin, b: ICoin) => {
      if (key === 'price_asc') return (a.price || 0) - (b.price || 0);
      if (key === 'change_desc') return (b.change || 0) - (a.change || 0);
      return 0;
    });
    setFilteredCoins(sorted);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-center text-cryptoRed">Error: {error}</div>;

  const displayCoins: ICoin[] = filteredCoins.length > 0 ? filteredCoins : allCoins;

  return (
    <div>
      <SearchBar onSearch={handleSearch} className="mb-6" />
      <div className="mb-4 flex space-x-2">
        <select
          onChange={(e) => handleSort(e.target.value)}
          value={sortBy}
          className="border rounded p-1 dark:bg-gray-800"
          aria-label="Sort coins"
        >
          <option value="price_asc">Sort by Price Asc</option>
          <option value="change_desc">Sort by Change Desc</option>
        </select>
      </div>
      <h2 className="text-xl font-bold mb-4">Top Coins</h2>
      <CoinTable coins={displayCoins} favorites={favorites} toggleFavorite={toggleFavorite} />
      {favorites.length > 0 && <Favorites favorites={favorites} toggleFavorite={toggleFavorite} />}
    </div>
  );
};

export default Dashboard;