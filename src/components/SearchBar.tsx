import { type FC, useState, useEffect, useCallback } from 'react';
import { Search } from 'lucide-react';

interface ISearchBarProps {
  onSearch: (query: string) => void;
  className?: string;
}

const SearchBar: FC<ISearchBarProps> = ({ onSearch, className = '' }) => {
  const [query, setQuery] = useState<string>('');

  const debouncedSearch = useCallback(
    (q: string) => {
      const timeoutId = setTimeout(() => onSearch(q), 300);
      return () => clearTimeout(timeoutId);
    },
    [onSearch]
  );

  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" aria-hidden="true" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search coins (e.g., Bitcoin)..."
        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:text-white"
        aria-label="Search coins"
      />
    </div>
  );
};

export default SearchBar;