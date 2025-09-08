import { type FC, useState, useEffect } from 'react';
import { useCoins } from '../hooks/useCoins';
import CoinTable from './CoinTable';
import type { IFavoritesProps } from '../types';
import type { ICoin } from '../types';

const Favorites: FC<IFavoritesProps> = ({ favorites, toggleFavorite }) => {
  const { coins } = useCoins(100);
  const [favoriteCoins, setFavoriteCoins] = useState<ICoin[]>([]);

  useEffect(() => {
    setFavoriteCoins(coins.filter((coin: ICoin) => favorites.includes(coin.id)));
  }, [coins, favorites]);

  if (favoriteCoins.length === 0) return null;

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Favorites</h2>
      <CoinTable coins={favoriteCoins} favorites={favorites} toggleFavorite={toggleFavorite} />
    </div>
  );
};

export default Favorites;