import { type FC, useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import styles from './SearchBar.module.css';

interface ISearchBarProps {
  onSearch: (query: string) => void;
  className?: string;
}

const SearchBar: FC<ISearchBarProps> = ({ onSearch, className = '' }) => {
  const [query, setQuery] = useState<string>('');

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearch(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, onSearch]);

  return (
    <div className={`${styles.searchContainer} ${className}`}>
      <Search className={styles.searchIcon} aria-hidden="true" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search coins..."
        className={styles.searchInput}
        aria-label="Search coins"
      />
    </div>
  );
};

export default SearchBar;