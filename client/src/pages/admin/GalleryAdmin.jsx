import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import DataStatusBar from "../../components/DataStatusBar";
import { notifyContentUpdate } from "../../hooks/useAutoRefresh";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

const GalleryAdmin = () => {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);

  // Fetch gallery data
  const fetchGalleryData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE}/api/gallery`);
      setGallery(response.data || []);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Error fetching gallery:", err);
      setError(err.message || "Failed to fetch gallery");
      setGallery([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchGalleryData();
  }, [fetchGalleryData]);

  // Manual refresh function
  const refresh = useCallback(() => {
    fetchGalleryData();
  }, [fetchGalleryData]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const resetForm = () => {
    setFormData({
      title: "",
    });
    setSelectedFile(null);
    setShowUploadForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      toast.error("Please select an image");
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("image", selectedFile);

      await axios.post(`${API_BASE}/api/gallery`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Admin-Auth": "admin-authenticated",
        },
      });

      toast.success("Image uploaded successfully");
      resetForm();
      refresh(); // Refresh data immediately
      
      // Trigger frontend refresh across all pages
      notifyContentUpdate('content-updated');
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    }
  };

  const handleDelete = async (imageId) => {
    if (!window.confirm("Are you sure you want to delete this image?")) {
      return;
    }

    // Store original state before optimistic update
    const originalGallery = [...gallery];

    try {
      // Optimistic update - remove from UI immediately
      const updatedGallery = gallery.filter(img => img.id !== imageId);
      setGallery(updatedGallery);

      await axios.delete(`${API_BASE}/api/gallery/${imageId}`, {
        headers: { "Admin-Auth": "admin-authenticated" },
      });

      toast.success("Image deleted successfully");
      
      // Trigger frontend refresh across all pages
      notifyContentUpdate('content-updated');
      
      // Don't call refresh() here - the optimistic update is already applied
    } catch (error) {
      console.error("Failed to delete image:", error);
      toast.error("Failed to delete image");
      // Revert optimistic update on error
      setGallery(originalGallery);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gallery Management</h2>
        <button
          onClick={() => setShowUploadForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
        >
          Upload Image
        </button>
      </div>

      {/* Data Status Bar */}
      <DataStatusBar
        lastUpdated={lastUpdated}
        loading={loading}
        error={error}
        onRefresh={refresh}
        dataCount={gallery.length}
        title="Gallery Images"
      />

      {/* Upload Form */}
      {showUploadForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Upload New Image</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
                >
                  Upload Image
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Gallery Grid */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading gallery...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {gallery.map((img) => (
            <div key={img.id} className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="relative">
                <img
                  src={`${API_BASE}/api/gallery/image/${img.id}`}
                  alt={img.title}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/400x300?text=Image+Not+Found";
                  }}
                />
                <button
                  onClick={() => handleDelete(img.id)}
                  className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full shadow-lg"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {img.title || "Untitled"}
                </h3>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && gallery.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No images in gallery</p>
        </div>
      )}
    </div>
  );
};

export default GalleryAdmin;
