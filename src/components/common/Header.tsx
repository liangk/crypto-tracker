import { type FC } from 'react';
import { Link } from 'react-router-dom';
import { SunIcon, MoonIcon, StarIcon } from '@heroicons/react/24/outline';
import styles from './Header.module.css';

interface IHeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  favorites: number;
}

const Header: FC<IHeaderProps> = ({ darkMode, toggleDarkMode, favorites }) => (
  <header className={styles.header}>
    <div className={styles.headerContainer}>
      <Link to="/" className={styles.headerTitle}>
        Crypto Tracker
      </Link>
      <div className={styles.headerActions}>
        <div className={styles.favoritesCount}>
          <StarIcon aria-hidden="true" />
          <span>{favorites}</span>
        </div>
        <button 
          onClick={toggleDarkMode} 
          className={styles.themeToggle} 
          aria-label="Toggle dark mode"
        >
          {darkMode ? <SunIcon /> : <MoonIcon />}
        </button>
      </div>
    </div>
  </header>
);

export default Header;