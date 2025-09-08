import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
// import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import type { IDashboardProps, IDetailsProps } from './types';
import Header from './components/common/Header';
import Dashboard from './components/Dashboard';
import CoinDetails from './components/CoinDetails';

function AppContent() {
  const [darkMode, setDarkMode] = useState<boolean>(() => localStorage.getItem('darkMode') === 'true');
  const [favorites, setFavorites] = useState<string[]>(() => JSON.parse(localStorage.getItem('favorites') || '[]'));
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleDarkMode = (): void => setDarkMode((prev) => !prev);
  const toggleFavorite = (coinId: string): void => {
    setFavorites((prev) =>
      prev.includes(coinId) ? prev.filter((id) => id !== coinId) : [...prev, coinId]
    );
  };

  const dashboardProps: IDashboardProps = { favorites, toggleFavorite };
  const detailsProps: IDetailsProps = { favorites, toggleFavorite };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} favorites={favorites.length} />
      <main className="container mx-auto p-4">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Dashboard {...dashboardProps} />} />
          <Route path="/coin/:id" element={<CoinDetails {...detailsProps} />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;