// components/GallerySection.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import heroBg from '../assets/gallery-hero.jpg';

const GallerySection = () => {
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/image-gallery/categorized`);
        setCategories(res.data);
      } catch (err) {
        console.error('Gallery fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  // Flatten all images for 'All' tab
  const allImages = categories.flatMap((cat) =>
    (cat.CategorizedGalleryImages || []).map((img) => ({ ...img, catName: cat.name }))
  );

  // Filter images by selected category
  const filteredImages =
    activeTab === 'All'
      ? allImages
      : allImages.filter((img) => img.catName === activeTab);

  return (
    <>
      {/* Hero Banner */}
      <div
        className="h-[350px] md:h-[420px] w-full bg-center bg-cover flex items-center relative"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="bg-black/40 w-full h-full absolute top-0 left-0" />
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-lg">
            Explore Our Gallery
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl">
            Our campus is more than just an appealing place to live—it’s a welcoming
            community where you’ll make lifelong friends and life-changing decisions.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white sticky top-[96px] z-40 border-b">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-4 overflow-x-auto no-scrollbar py-3">
            {['All', ...categories.map((c) => c.name)].map((label) => (
              <button
                key={label}
                onClick={() => setActiveTab(label)}
                className={`relative px-3 py-1.5 font-semibold whitespace-nowrap transition-all duration-300
                  ${
                    activeTab === label
                      ? 'text-red-600 after:scale-x-100'
                      : 'text-gray-700 hover:text-red-600 after:scale-x-0'
                  }
                  after:content-[''] after:absolute after:left-0 after:bottom-0
                  after:h-[2px] after:w-full after:bg-red-600 after:transition-transform after:origin-left
                `}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          {loading ? (
            <p className="text-center animate-pulse">Loading images …</p>
          ) : filteredImages.length === 0 ? (
            <p className="text-center italic text-gray-500">
              No images available for {activeTab}.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              {filteredImages.map((img) => (
                <div
                  key={img.id}
                  className="rounded-lg overflow-hidden shadow-md hover:shadow-xl transition duration-300"
                >
                  <img
                    src={img.image_url.startsWith('http') ? img.image_url : `${process.env.REACT_APP_API_BASE_URL}/api/image-gallery/image/${img.id}`}
                    alt={img.catName}
                    loading="lazy"
                    className="w-full h-64 object-cover transition-transform duration-300 hover:scale-105"
                    onError={e => { e.target.onerror = null; e.target.src = '/fallback.png'; }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default GallerySection;
