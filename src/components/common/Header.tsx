import { type FC } from 'react';
import { Link } from 'react-router-dom';
import { SunIcon, MoonIcon, StarIcon } from '@heroicons/react/24/outline';

interface IHeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  favorites: number;
}

const Header: FC<IHeaderProps> = ({ darkMode, toggleDarkMode, favorites }) => (
  <header className="bg-gradient-to-r from-primary to-blue-700 dark:from-gray-800 dark:to-gray-900 text-white p-4 shadow-lg">
    <div className="container mx-auto flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold">Crypto Tracker</Link>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1">
          <StarIcon className="h-5 w-5" aria-hidden="true" />
          <span>{favorites}</span>
        </div>
        <button onClick={toggleDarkMode} aria-label="Toggle dark mode">
          {darkMode ? <SunIcon className="h-6 w-6" /> : <MoonIcon className="h-6 w-6" />}
        </button>
      </div>
    </div>
  </header>
);

export default Header;