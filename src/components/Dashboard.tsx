import { type FC, useState, useEffect } from 'react';
import { useCoins } from '../hooks/useCoins';
import LoadingSpinner from './common/LoadingSpinner';
import SearchBar from './SearchBar';
import CoinTable from './CoinTable';
import Favorites from './Favorites';
import type { ICoin } from '../types';
import type { IDashboardProps } from '../types';
import './Dashboard.scss';
import { usePolling } from '../hooks/usePolling';

const Dashboard: FC<IDashboardProps> = ({ favorites, toggleFavorite }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('market_cap_desc');
  const [filteredCoins, setFilteredCoins] = useState<ICoin[]>([]);
  const { coins: allCoins, loading, error, setCoins } = useCoins(50);

  // Continuously merge fresh ticker data into the source-of-truth list
  usePolling(allCoins, setCoins);

  const handleSearch = (query: string): void => {
    setSearchQuery(query);
  };

  const handleSort = (key: string): void => {
    setSortBy(key);
  };

  // Derive the visible list from the source coins + current UI controls
  useEffect(() => {
    let list: ICoin[] = allCoins;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter((coin) =>
        coin.name.toLowerCase().includes(q) || coin.symbol.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'price_asc') {
      list = [...list].sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === 'price_desc') {
      list = [...list].sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortBy === 'change_asc') {
      list = [...list].sort((a, b) => (a.change || 0) - (b.change || 0));
    } else if (sortBy === 'change_desc') {
      list = [...list].sort((a, b) => (b.change || 0) - (a.change || 0));
    } else if (sortBy === 'market_cap_asc') {
      list = [...list].sort((a, b) => (a.market_cap || 0) - (b.market_cap || 0));
    } else if (sortBy === 'market_cap_desc') {
      list = [...list].sort((a, b) => (b.market_cap || 0) - (a.market_cap || 0));
    }

    setFilteredCoins(list);
  }, [allCoins, searchQuery, sortBy]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="dashboard">
      <h2 className="title">Crypto markets</h2>
      <div className="filterContainer">
        <SearchBar onSearch={handleSearch} className="searchBar" />
        <div className="sortContainer">
          <select onChange={(e) => handleSort(e.target.value)} value={sortBy} className="sortSelect" aria-label="Sort coins">
            <option value="price_asc">Sort by Price Asc</option>
            <option value="price_desc">Sort by Price Desc</option>
            <option value="change_asc">Sort by Change Asc</option>
            <option value="change_desc">Sort by Change Desc</option>
            <option value="market_cap_asc">Sort by Market Cap Asc</option>
            <option value="market_cap_desc">Sort by Market Cap Desc</option>
          </select>
        </div>
      </div>
      <CoinTable coins={filteredCoins} favorites={favorites} toggleFavorite={toggleFavorite} />
      {favorites.length > 0 && <Favorites favorites={favorites} toggleFavorite={toggleFavorite} />}
    </div>
  );
};

export default Dashboard;