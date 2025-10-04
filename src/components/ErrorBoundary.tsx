import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary: Caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className='min-h-screen flex items-center justify-center bg-gray-50'>
          <div className='max-w-md w-full bg-white shadow-lg rounded-lg p-6'>
            <div className='flex items-center'>
              <div className='flex-shrink-0'>
                <svg
                  className='h-8 w-8 text-red-500'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
                  />
                </svg>
              </div>
              <div className='ml-3'>
                <h3 className='text-lg font-medium text-gray-900'>
                  Something went wrong
                </h3>
                <div className='mt-2 text-sm text-gray-500'>
                  <p>
                    We're sorry, but something unexpected happened. Please try
                    refreshing the page.
                  </p>
                  {process.env.NODE_ENV === 'development' &&
                    this.state.error && (
                      <details className='mt-2'>
                        <summary className='cursor-pointer text-red-600'>
                          Error details
                        </summary>
                        <pre className='mt-2 text-xs text-red-600 whitespace-pre-wrap'>
                          {this.state.error.toString()}
                        </pre>
                      </details>
                    )}
                </div>
                <div className='mt-4'>
                  <button
                    onClick={() => window.location.reload()}
                    className='bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
                  >
                    Refresh Page
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
