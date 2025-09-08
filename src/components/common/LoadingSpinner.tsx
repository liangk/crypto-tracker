import { type FC } from 'react';

const LoadingSpinner: FC = () => (
  <div className="flex justify-center items-center p-8 dark:text-white">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    <span className="ml-2 text-lg">Loading...</span>
  </div>
);

export default LoadingSpinner;