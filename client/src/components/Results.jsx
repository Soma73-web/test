import React, { useState, useCallback, useMemo } from "react";
import Slider from "react-slick";
import api from "../api";
import { NextArrow, PrevArrow } from "./BlueArrows";
import LoadingSpinner from "./LoadingSpinner";
import EmptyState from "./EmptyState";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useAutoRefresh } from "../hooks/useAutoRefresh";
import logger from "../utils/logger";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

const Results = () => {
  const [items, setItems] = useState([]);
  const [years, setYears] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchResults = useCallback(async (refreshType = 'initial') => {
    try {
      logger.log(`Fetching results (${refreshType})...`);
      const res = await api.get("/api/results");
      
      // Remove duplicates by ID and ensure unique entries
      const uniqueData = res.data.reduce((acc, current) => {
        const x = acc.find(item => item.id === current.id);
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, []);
      
      const data = uniqueData.map((r) => ({
        ...r,
        photoUrl: `${API_BASE}/api/results/${r.id}/image?t=${Date.now()}`, // Add cache busting
      }));
      setItems(data);

      const ys = [...new Set(data.map((r) => r.year))].sort((a, b) => b - a);
      setYears(ys);
      setSelected(ys[0] ?? null);
    } catch (err) {
      logger.error("Failed to load results:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Use the auto-refresh hook
  useAutoRefresh(fetchResults, [], 30000); // Refresh every 30 seconds

  const filtered = selected ? items.filter((i) => i.year === selected) : [];

  const slick = useMemo(() => ({
    dots: true,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  }), []);

  const handleYearSelect = useCallback((year) => {
    setSelected(year);
  }, []);

  return (
    <section
      id="results"
      className="py-16 bg-gradient-to-br from-blue-50 via-white to-indigo-50 scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Clean Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our <span className="text-blue-600">Top Achievers</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Celebrating the success of our students who have achieved excellence
            in NEET examinations
          </p>
          <div className="w-24 h-1 bg-blue-600 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Year Filter */}
        {years.length > 0 && (
          <div className="flex justify-center gap-2 mb-10 flex-wrap">
            {years.map((year) => (
              <button
                key={year}
                onClick={() => handleYearSelect(year)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  selected === year
                    ? "bg-blue-600 text-white shadow-lg transform scale-105"
                    : "bg-white text-blue-600 border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50"
                }`}
              >
                NEET {year}
              </button>
            ))}
          </div>
        )}

        {/* Loading / Empty / Results */}
        {loading ? (
          <LoadingSpinner message="Loading our achievers..." />
        ) : !filtered.length ? (
          <EmptyState
            icon="🏆"
            title="Results Coming Soon"
            message={
              selected
                ? `Results for NEET ${selected} will be updated soon`
                : "Our achievers' results will be showcased here"
            }
          />
        ) : (
          <div className="mt-8">
            <Slider {...slick}>
              {filtered.map((r) => (
                <div key={r.id} className="px-3">
                  <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100">
                    {/* Student Image */}
                    <div className="relative p-6 pb-4">
                      <div className="relative mx-auto w-32 h-32 mb-4">
                        <img
                          src={r.photoUrl}
                          alt={r.name}
                          loading="lazy"
                          className="w-full h-full object-cover rounded-full border-4 border-yellow-400 shadow-lg"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = "/fallback.png";
                          }}
                        />
                      </div>

                      {/* Student Info */}
                      <div className="text-center">
                        <h4 className="text-xl font-bold text-gray-800 mb-2 leading-tight">
                          {r.name}
                        </h4>

                        {/* Rank Badge */}
                        <div className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-full text-sm font-semibold mb-3 shadow-md">
                          AIR: {r.rank}
                        </div>

                        {/* College Info */}
                        {r.college && (
                          <div className="mt-3">
                            <p className="text-xs text-gray-500 mb-1">
                              Admitted to
                            </p>
                            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-medium px-3 py-2 rounded-lg">
                              {r.college}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Join Our Success Story
            </h3>
            <p className="text-gray-600 mb-6">
              Be the next achiever to make it to our results showcase. Start
              your NEET preparation journey with us today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold transition-colors duration-300 shadow-lg">
                Enroll Now
              </button>
              <button className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-3 rounded-full font-semibold transition-all duration-300">
                View All Results
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Results;
