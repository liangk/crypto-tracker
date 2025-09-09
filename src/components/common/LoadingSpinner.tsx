import { type FC } from 'react';
import styles from './LoadingSpinner.module.css';

const LoadingSpinner: FC = () => (
  <div className={styles.loadingSpinner}>
    <div className={styles.spinner}></div>
    <span className={styles.loadingText}>Loading...</span>
  </div>
);

export default LoadingSpinner;