import React, { useState, useCallback } from "react";
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

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  const fetchGallery = useCallback(async (refreshType = 'initial') => {
    try {
      logger.log(`Fetching gallery (${refreshType})...`);
      setLoading(true);
      const response = await api.get(`${API_BASE}/api/gallery`);
      
      // Remove duplicates by ID and ensure unique entries
      const uniqueData = response.data.reduce((acc, current) => {
        const x = acc.find(item => item.id === current.id);
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, []);
      
      const data = uniqueData.map((img) => ({
        ...img,
        imageUrl: `${API_BASE}/api/gallery/image/${img.id}?t=${Date.now()}`, // Add cache busting
      }));
      setImages(data || []);
    } catch (error) {
      logger.error("Error fetching gallery:", error);
      setImages([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Use the auto-refresh hook
  useAutoRefresh(fetchGallery, [], 30000); // Refresh every 30 seconds

  const handleImageClick = useCallback((image) => {
    setSelectedImage(image);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedImage(null);
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading gallery..." />;
  }

  if (!images.length) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">📸</div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Gallery Coming Soon</h3>
        <p className="text-gray-500">We will update this section with amazing photos soon.</p>
      </div>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our <span className="text-blue-600">Gallery</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore moments from our institute, events, and student activities
          </p>
          <div className="w-24 h-1 bg-blue-600 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((image) => (
            <div
              key={image.id}
              className="group cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              onClick={() => handleImageClick(image)}
            >
              <div className="aspect-w-1 aspect-h-1 bg-gray-200">
                <img
                  src={image.imageUrl}
                  alt={image.title || "Gallery image"}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/400x400?text=Image+Not+Found";
                  }}
                />
              </div>
              {image.title && (
                <div className="p-4 bg-white">
                  <h3 className="text-sm font-semibold text-gray-800 truncate">
                    {image.title}
                  </h3>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Image Modal */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="relative max-w-4xl max-h-full">
              <img
                src={selectedImage.imageUrl}
                alt={selectedImage.title || "Gallery image"}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300"
              >
                ×
              </button>
              {selectedImage.title && (
                <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white p-2 rounded">
                  {selectedImage.title}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;
