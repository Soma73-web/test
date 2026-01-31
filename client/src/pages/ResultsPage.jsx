import React, { useState, useCallback } from "react";
import api from "../api";
import { useAutoRefresh } from "../hooks/useAutoRefresh";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

const ResultPage = () => {
  const [items, setItems] = useState([]);
  const [years, setYears] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const fetchResults = useCallback(async (refreshType = 'initial') => {
    try {
      console.log(`Fetching results (${refreshType})...`);
      const res = await api.get("/api/results");
      const data = res.data.map((r) => ({
        ...r,
        photoUrl: `${API_BASE}/api/results/${r.id}/image?t=${Date.now()}`, // Add cache busting
      }));
      setItems(data);

      const ys = [...new Set(data.map((r) => r.year))].sort((a, b) => b - a);
      setYears(ys);
      setSelected(ys[0] ?? null);
    } catch (err) {
      console.error("Failed to load results:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Use the auto-refresh hook
  useAutoRefresh(fetchResults, [], 30000);

  const filtered = selected
    ? items.filter((i) => String(i.year) === String(selected))
    : [];

  return (
    <div className="pt-0 bg-white min-h-screen">
      {/* Hero/Header Section */}
      <div className="relative w-full h-64 md:h-80 flex items-center justify-center mb-8 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1200&q=80"
          alt="Results Hero"
          className="absolute inset-0 w-full h-full object-cover object-center z-0"
        />
        <div className="absolute inset-0 bg-blue-800 bg-opacity-70 z-10"></div>
        <div className="relative z-20 flex flex-col items-center justify-center w-full px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white text-center mb-4 drop-shadow-lg">Our Achievers</h1>
          <p className="text-lg md:text-2xl text-white text-center max-w-2xl drop-shadow-md">
            Celebrating the success stories of our students who have excelled in NEET examinations and made us proud.
          </p>
        </div>
      </div>

        {/* Year Filter */}
        {years.length > 0 && (
        <div className="flex justify-center gap-0 mb-10 px-2 relative">
          {years.map((year, idx) => (
            <div key={year} className="relative flex flex-col items-center">
              <button
                onClick={() => setSelected(year)}
                className={`px-10 py-4 rounded-none font-semibold text-lg transition-all duration-200 whitespace-nowrap border-0 focus:outline-none ${
                  String(selected) === String(year)
                    ? "bg-blue-600 text-white font-bold shadow-md z-10"
                    : "bg-gray-100 text-blue-800 hover:bg-blue-100 z-0"
                }`}
                style={{ borderRadius: idx === 0 ? '12px 0 0 12px' : idx === years.length - 1 ? '0 12px 12px 0' : '0' }}
              >
                NEET {year}
              </button>
              {/* Arrow under active tab */}
              {String(selected) === String(year) && (
                <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-blue-600 mt-0.5"></div>
              )}
            </div>
            ))}
          </div>
        )}

        {/* Results Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600 text-lg">Loading results...</p>
          </div>
        ) : !filtered.length ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Results Coming Soon</h3>
            <p className="text-gray-500">We will update this section as soon as results are available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filtered.map((item) => (
              <div key={item.id} className="flex flex-col items-center border border-blue-200 rounded-lg shadow-md overflow-hidden bg-white">
                {/* Square Photo */}
                <div className="w-full aspect-square bg-gray-100 flex items-center justify-center overflow-hidden border-b border-blue-200">
                      <img
                    src={item.photoUrl}
                    alt={item.name}
                    className="object-cover w-full h-full"
                    onError={e => { e.target.onerror = null; e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(item.name); }}
                  />
                </div>
                {/* Name and College on blue bar */}
                <div className="w-full bg-blue-600 py-3 px-2 flex flex-col items-center">
                  <div className="text-lg font-bold text-white text-center leading-tight">{item.name}</div>
                  <div className="text-sm text-yellow-300 text-center font-medium mt-1">{item.college || <span className='text-blue-200'>—</span>}</div>
                </div>
              </div>
            ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default ResultPage;
