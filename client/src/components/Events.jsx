import React, { useState, useCallback } from "react";
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner";
import EmptyState from "./EmptyState";
import { useAutoRefresh } from "../hooks/useAutoRefresh";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  const fetchEvents = useCallback(async (refreshType = 'initial') => {
    try {
      console.log(`Fetching events (${refreshType})...`);
      const response = await axios.get(`${API_BASE}/api/events`);
      
      // Remove duplicates by ID and ensure unique entries
      const uniqueData = response.data.reduce((acc, current) => {
        const x = acc.find(item => item.id === current.id);
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, []);
      
      // Filter events that have images only
      const eventsWithImages = uniqueData.filter(
        (event) => event.imageUrl,
      );
      setEvents(eventsWithImages);
    } catch (error) {
      console.error("Failed to load events:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Use the auto-refresh hook
  useAutoRefresh(fetchEvents, [], 30000);

  // Manual slide navigation
  const goToSlide = useCallback((index) => {
    setCurrentSlide(index);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % events.length);
  }, [events.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + events.length) % events.length);
  }, [events.length]);

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">

        {loading ? (
          <LoadingSpinner message="Our team is preparing exciting events for you..." />
        ) : events.length === 0 ? (
          <EmptyState
            icon="🎉"
            title="Events Coming Soon"
            message="Stay tuned for exciting events and activities. Our team is planning something amazing!"
          />
        ) : (
          <div className="relative">
            {/* Full-Cover Slider - Images Only */}
            <div className="relative h-96 md:h-[500px] lg:h-[600px] overflow-hidden rounded-2xl shadow-2xl">
              {/* Slides - Images Only */}
              {events.map((event, index) => (
                <div
                  key={event.id}
                  className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                    index === currentSlide
                      ? "opacity-100 transform translate-x-0"
                      : "opacity-0 transform translate-x-full"
                  }`}
                >
                  {/* Full-cover image only */}
                  <img
                    src={`${API_BASE}/api/events/image/${event.id}`}
                    alt="Event"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}

              {/* Navigation Arrows */}
              {events.length > 1 && (
                <>
                  {/* Previous Button */}
                  <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
                    aria-label="Previous slide"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  {/* Next Button */}
                  <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
                    aria-label="Next slide"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}

              {/* Slide Indicators */}
              {events.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {events.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentSlide
                          ? "bg-white scale-125"
                          : "bg-white/50 hover:bg-white/75"
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Thumbnail Navigation (for multiple events) */}
            {events.length > 1 && (
              <div className="mt-6 flex justify-center space-x-4 overflow-x-auto pb-2">
                {events.map((event, index) => (
                  <button
                    key={event.id}
                    onClick={() => goToSlide(index)}
                    className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden transition-all duration-300 ${
                      index === currentSlide
                        ? "ring-4 ring-blue-500 scale-110"
                        : "ring-2 ring-gray-300 hover:ring-blue-300"
                    }`}
                  >
                    <img
                      src={`${API_BASE}/api/events/image/${event.id}`}
                      alt={`Event ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Events;
