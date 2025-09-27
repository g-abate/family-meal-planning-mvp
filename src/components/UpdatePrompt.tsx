import React, { useState, useEffect } from 'react';

interface UpdatePromptProps {
  className?: string;
}

const UpdatePrompt: React.FC<UpdatePromptProps> = ({ className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check for service worker updates
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        setIsVisible(true);
      });
    }
  }, []);

  const handleUpdate = () => {
    if ('serviceWorker' in navigator) {
      void navigator.serviceWorker.getRegistration().then(registration => {
        if (registration?.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
      });
    }
    setIsVisible(false);
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-sm z-50 ${className}`}
    >
      <div className='flex items-start'>
        <div className='flex-shrink-0'>
          <svg
            className='h-5 w-5 text-blue-500'
            fill='currentColor'
            viewBox='0 0 20 20'
          >
            <path
              fillRule='evenodd'
              d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
              clipRule='evenodd'
            />
          </svg>
        </div>
        <div className='ml-3 flex-1'>
          <h3 className='text-sm font-medium text-gray-900'>
            App Update Available
          </h3>
          <p className='mt-1 text-sm text-gray-500'>
            A new version of the app is available. Would you like to update now?
          </p>
          <div className='mt-3 flex space-x-2'>
            <button
              onClick={handleUpdate}
              className='bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              Update
            </button>
            <button
              onClick={handleDismiss}
              className='bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500'
            >
              Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdatePrompt;
