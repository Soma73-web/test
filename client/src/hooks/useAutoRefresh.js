import { useEffect, useCallback } from 'react';
import logger from '../utils/logger';

// Global refresh trigger
let refreshCallbacks = new Set();

// Function to trigger refresh across all components
export const triggerGlobalRefresh = (type = 'general') => {
  logger.log(`Triggering global refresh: ${type}`);
  refreshCallbacks.forEach(callback => callback(type));
};

// Custom hook for auto-refresh functionality
export const useAutoRefresh = (callback, dependencies = [], refreshInterval = 30000) => {
  const memoizedCallback = useCallback(callback, dependencies);

  useEffect(() => {
    // Add callback to global set
    refreshCallbacks.add(memoizedCallback);

    // Initial call
    memoizedCallback('initial');

               // Set up interval for auto-refresh
           const interval = setInterval(() => {
             logger.log('Auto-refresh triggered');
             memoizedCallback('interval');
           }, refreshInterval);

               // Listen for storage events (when admin makes changes)
           const handleStorageChange = (e) => {
             if (e.key === 'slider-updated' || e.key === 'content-updated') {
               logger.log(`Content update detected: ${e.key}, refreshing...`);
               memoizedCallback('storage');
             }
           };

    window.addEventListener('storage', handleStorageChange);

    // Cleanup
    return () => {
      refreshCallbacks.delete(memoizedCallback);
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [memoizedCallback, refreshInterval]);
};

// Function to trigger refresh from admin panel
export const notifyContentUpdate = (type = 'content-updated') => {
  localStorage.setItem(type, Date.now().toString());
  triggerGlobalRefresh(type);
}; 