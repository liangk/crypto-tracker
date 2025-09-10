import { Component, type ErrorInfo, type ReactNode } from 'react';
import './ErrorBoundary.scss';

interface IErrorBoundaryProps {
  children: ReactNode;
}

interface IErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<IErrorBoundaryProps, IErrorBoundaryState> {
  constructor(props: IErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  public static getDerivedStateFromError(error: Error): IErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="errorBoundary">
          <h2 className="errorTitle">Something went wrong.</h2>
          <p className="errorMessage">
            {this.state.error?.message || 'An unknown error occurred. Please try reloading the page.'}
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="reloadButton"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export { ErrorBoundary };