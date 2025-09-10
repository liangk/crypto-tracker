import { type FC, useState } from 'react';
import { useCoins } from '../hooks/useCoins';
import LoadingSpinner from './common/LoadingSpinner';
import SearchBar from './SearchBar';
import CoinTable from './CoinTable';
import Favorites from './Favorites';
import type { ICoin } from '../types';
import type { IDashboardProps } from '../types';
import './Dashboard.scss';

const Dashboard: FC<IDashboardProps> = ({ favorites, toggleFavorite }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('market_cap_desc');
  const [filteredCoins, setFilteredCoins] = useState<ICoin[]>([]);
  const { coins: allCoins, loading, error } = useCoins(50);

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
    console.log(sorted);
    setFilteredCoins(sorted);
  };

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
            <option value="change_desc">Sort by Change Desc</option>
          </select>
        </div>
      </div>
      <CoinTable coins={filteredCoins} favorites={favorites} toggleFavorite={toggleFavorite} />
      {favorites.length > 0 && <Favorites favorites={favorites} toggleFavorite={toggleFavorite} />}
    </div>
  );
};

export default Dashboard;