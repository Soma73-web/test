import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AnalyticsTrendsChart = ({ trends, loading, error }) => {
  if (loading) {
    return (
      <div className="bg-white border rounded-lg p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
        <div className="text-gray-600">Loading trends...</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="bg-white border rounded-lg p-6 text-center text-red-600">
        Error loading trends: {error}
      </div>
    );
  }
  if (!trends || trends.length === 0) {
    return (
      <div className="bg-white border rounded-lg p-6 text-center text-gray-600">
        No analytics data available.
      </div>
    );
  }
  const data = {
    labels: trends.map((t) => t.date),
    datasets: [
      {
        label: "Hits",
        data: trends.map((t) => t.hits),
        borderColor: "#6366f1",
        backgroundColor: "#6366f133",
        tension: 0.3,
      },
      {
        label: "Unique Visitors",
        data: trends.map((t) => t.visitors),
        borderColor: "#22c55e",
        backgroundColor: "#22c55e33",
        tension: 0.3,
      },
    ],
  };
  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Last 30 Days: Hits & Unique Visitors" },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };
  return (
    <div className="bg-white border rounded-lg p-6">
      <Line data={data} options={options} />
    </div>
  );
};

export default AnalyticsTrendsChart; 