import { type FC } from 'react';
import { Link } from 'react-router-dom';
import { SunIcon, MoonIcon, StarIcon } from '@heroicons/react/24/outline';
import './Header.scss'


interface IHeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  favorites: number;
}

const Header: FC<IHeaderProps> = ({ darkMode, toggleDarkMode, favorites }) => (
  <header className="header">
    <div className="headerContainer">
      <Link to="/" className="headerTitle">Crypto Tracker</Link>
      <div className="headerActions">
        <div className="favoritesCount">
          <StarIcon aria-hidden="true" /><span>{favorites}</span>
        </div>
        <button onClick={toggleDarkMode} className="themeToggle" aria-label="Toggle dark mode">
          {darkMode ? <SunIcon /> : <MoonIcon />}
        </button>
      </div>
    </div>
  </header>
);

export default Header;