import { type FC } from 'react';
import './LoadingSpinner.scss';

const LoadingSpinner: FC = () => (
  <div className="loadingSpinner">
    <div className="spinner"></div>
    <span className="loadingText">Loading...</span>
  </div>
);

export default LoadingSpinner;