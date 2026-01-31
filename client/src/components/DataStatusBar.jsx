import React from 'react';

const DataStatusBar = ({ 
  lastUpdated, 
  loading, 
  error, 
  onRefresh, 
  dataCount = 0,
  title = "Data"
}) => {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            <span className="font-medium">{title}:</span> {dataCount || 0} items
          </div>
          
          {lastUpdated && (
            <div className="text-sm text-gray-500">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
          )}
          
          {loading && (
            <div className="flex items-center gap-2 text-blue-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm">Refreshing...</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {error && (
            <div className="text-sm text-red-600">
              Error: {error}
            </div>
          )}
          
          <button 
            onClick={onRefresh} 
            disabled={loading}
            className="text-sm text-blue-600 hover:text-blue-800 underline disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Refreshing...' : 'Refresh Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataStatusBar; 