import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CoinTable from '../CoinTable';
import type { ICoin } from '../../types';

// Mock data for testing
const mockCoins: ICoin[] = [
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'BTC',
    price: 50000,
    change: 2.5,
    volume: 1000000,
    quotes: {
      USD: {
        price: 50000,
        percent_change_24h: 2.5,
        volume_24h: 1000000,
        market_cap: 1000000000
      }
    }
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    price: 3000,
    change: -1.2,
    volume: 500000,
    quotes: {
      USD: {
        price: 3000,
        percent_change_24h: -1.2,
        volume_24h: 500000,
        market_cap: 360000000
      }
    }
  }
];

describe('CoinTable', () => {
  const mockToggleFavorite = vi.fn();
  
  it('renders a table with coin data', () => {
    render(
      <CoinTable 
        coins={mockCoins} 
        favorites={[]} 
        toggleFavorite={mockToggleFavorite} 
      />
    );
    
    // Check if table headers are rendered
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Price')).toBeInTheDocument();
    expect(screen.getByText('24h %')).toBeInTheDocument();
    expect(screen.getByText('24h Volume')).toBeInTheDocument();
    
    // Check if coin data is rendered
    expect(screen.getByText('Bitcoin')).toBeInTheDocument();
    expect(screen.getByText('Ethereum')).toBeInTheDocument();
    expect(screen.getByText('$50,000.00')).toBeInTheDocument();
    expect(screen.getByText('$3,000.00')).toBeInTheDocument();
  });

  it('calls toggleFavorite when star icon is clicked', () => {
    render(
      <CoinTable 
        coins={[mockCoins[0]]} 
        favorites={[]} 
        toggleFavorite={mockToggleFavorite} 
      />
    );
    
    const starButton = screen.getByRole('button', { name: /add to favorites: bitcoin/i });
    fireEvent.click(starButton);
    
    expect(mockToggleFavorite).toHaveBeenCalledWith('bitcoin');
  });

  it('shows filled star for favorited coins', () => {
    render(
      <CoinTable 
        coins={[mockCoins[0]]} 
        favorites={['bitcoin']} 
        toggleFavorite={mockToggleFavorite} 
      />
    );
    
    const starButton = screen.getByRole('button', { name: /remove from favorites: bitcoin/i });
    expect(starButton).toBeInTheDocument();
  });
});
