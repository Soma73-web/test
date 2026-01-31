import React from "react";
import { FaChartBar, FaUsers, FaArrowUp, FaArrowDown } from "react-icons/fa";

const StatDelta = ({ value, percent }) => {
  if (value === 0) return null;
  const isUp = value > 0;
  return (
    <span className={`ml-2 inline-flex items-center text-sm font-medium ${isUp ? 'text-green-600' : 'text-red-600'}`}>
      {isUp ? <FaArrowUp className="inline mr-1" /> : <FaArrowDown className="inline mr-1" />}
      {isUp ? '+' : ''}{value} ({percent}%)
    </span>
  );
};

const AnalyticsSummary = ({ hits, visitors, loading, error, hitsIncrease, hitsPercent, visitorsIncrease, visitorsPercent }) => {
  if (loading) {
    return (
      <div className="bg-white border rounded-lg p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
        <div className="text-gray-600">Loading analytics...</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="bg-white border rounded-lg p-6 text-center text-red-600">
        Error loading analytics: {error}
      </div>
    );
  }
  return (
    <div className="bg-white border rounded-lg p-6 grid grid-cols-1 sm:grid-cols-2 gap-6 text-center">
      <div className="flex flex-col items-center">
        <FaChartBar className="text-3xl text-indigo-600 mb-2" />
        <div className="text-2xl font-bold text-indigo-800 flex items-center justify-center">
          {hits ?? 0}
          <StatDelta value={hitsIncrease} percent={hitsPercent} />
        </div>
        <div className="text-gray-700">Today's Hits</div>
      </div>
      <div className="flex flex-col items-center">
        <FaUsers className="text-3xl text-green-600 mb-2" />
        <div className="text-2xl font-bold text-green-700 flex items-center justify-center">
          {visitors ?? 0}
          <StatDelta value={visitorsIncrease} percent={visitorsPercent} />
        </div>
        <div className="text-gray-700">Today's Unique Visitors</div>
      </div>
    </div>
  );
};

export default AnalyticsSummary; 