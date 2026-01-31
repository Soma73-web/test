import React, { useState, useEffect } from "react";
import api from "../../api";
import { notifyContentUpdate } from "../../hooks/useAutoRefresh";

const StudyMaterialAdmin = () => {
  const [materials, setMaterials] = useState([]);
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [formData, setFormData] = useState({
    subject: "Biology",
    topic: "",
    videoUrl: "",
    description: "",
    duration: "",
    orderIndex: 0,
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const subjects = ["Biology", "Chemistry", "Physics", "Mathematics"];

  useEffect(() => {
    fetchMaterials();
  }, []);

  useEffect(() => {
    if (selectedSubject === "All") {
      setFilteredMaterials(materials);
    } else {
      setFilteredMaterials(
        materials.filter((m) => m.subject === selectedSubject),
      );
    }
  }, [materials, selectedSubject]);

  const fetchMaterials = async () => {
    try {
      const response = await api.get("/api/study-materials");
      setMaterials(response.data || []);
    } catch (error) {
      console.error("Error fetching study materials:", error);
      alert("Failed to fetch study materials");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const extractVideoId = (url) => {
    if (!url) return null;

    // YouTube URL patterns
    const patterns = [
      /(?:youtube\.com\/watch\?v=)([^&\n?#]+)/,
      /(?:youtu\.be\/)([^&\n?#]+)/,
      /(?:youtube\.com\/embed\/)([^&\n?#]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate video URL
      const videoId = extractVideoId(formData.videoUrl);
      if (!videoId) {
        alert("Please enter a valid YouTube URL");
        setLoading(false);
        return;
      }

      if (editingId) {
        await api.put(`/api/study-materials/${editingId}`, formData);
      } else {
        await api.post("/api/study-materials", formData);
      }

      resetForm();
      await fetchMaterials();
      
      // Trigger frontend refresh across all pages
      notifyContentUpdate('content-updated');
      
      alert("Study material saved successfully!");
    } catch (error) {
      console.error("Error saving study material:", error);
      alert("Failed to save study material");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (material) => {
    setFormData({
      subject: material.subject,
      topic: material.topic,
      videoUrl: material.videoUrl,
      description: material.description || "",
      duration: material.duration || "",
      orderIndex: material.orderIndex || 0,
    });
    setEditingId(material.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this study material?"))
      return;

    // Store original state before optimistic update
    const originalMaterials = [...materials];

    try {
      // Optimistic update - remove from UI immediately
      const updatedMaterials = materials.filter(m => m.id !== id);
      setMaterials(updatedMaterials);

      await api.delete(`/api/study-materials/${id}`);
      
      // Trigger frontend refresh across all pages
      notifyContentUpdate('content-updated');
      
      // Don't call fetchMaterials() here - the optimistic update is already applied
    } catch (error) {
      console.error("Error deleting study material:", error);
      alert("Failed to delete study material");
      // Revert optimistic update on error
      setMaterials(originalMaterials);
    }
  };

  const resetForm = () => {
    setFormData({
      subject: "Biology",
      topic: "",
      videoUrl: "",
      description: "",
      duration: "",
      orderIndex: 0,
    });
    setEditingId(null);

    // Reset form inputs
    const form = document.querySelector("form");
    if (form) form.reset();

    // Reset subject selector to Biology
    const subjectSelect = document.querySelector('select[name="subject"]');
    if (subjectSelect) subjectSelect.value = "Biology";
  };

  const getEmbedUrl = (url) => {
    const videoId = extractVideoId(url);
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-6 text-blue-800">
        Manage Study Materials
      </h3>

      {/* Study Material Form */}
      <form onSubmit={handleSubmit} className="mb-8 bg-gray-50 p-4 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">Subject</label>
            <select
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              {subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Topic</label>
            <input
              type="text"
              name="topic"
              value={formData.topic}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            YouTube Video URL
          </label>
          <input
            type="url"
            name="videoUrl"
            value={formData.videoUrl}
            onChange={handleInputChange}
            placeholder="https://www.youtube.com/watch?v=..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Duration (optional)
            </label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              placeholder="e.g., 15:30"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Order Index
            </label>
            <input
              type="number"
              name="orderIndex"
              value={formData.orderIndex}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Description (optional)
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Video Preview */}
        {formData.videoUrl && extractVideoId(formData.videoUrl) && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Preview</label>
            <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-md overflow-hidden">
              <iframe
                src={getEmbedUrl(formData.videoUrl)}
                title="Video Preview"
                className="w-full h-64"
                frameBorder="0"
                allowFullScreen
              />
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading
              ? "Saving..."
              : editingId
                ? "Update Material"
                : "Add Material"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Filter by Subject */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          Filter by Subject
        </label>
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="All">All Subjects</option>
          {subjects.map((subject) => (
            <option key={subject} value={subject}>
              {subject}
            </option>
          ))}
        </select>
      </div>

      {/* Materials List */}
      <div className="space-y-4">
        <h4 className="text-lg font-medium">
          Existing Materials ({filteredMaterials.length})
        </h4>

        {filteredMaterials.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No study materials found. Add your first material above.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredMaterials.map((material) => (
              <div
                key={material.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-1">
                      {material.topic}
                    </h5>
                    <div className="flex gap-2 text-sm">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {material.subject}
                      </span>
                      {material.duration && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                          {material.duration}
                        </span>
                      )}
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">
                        Order: {material.orderIndex}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(material)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(material.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {material.description && (
                  <p className="text-sm text-gray-600 mb-3">
                    {material.description}
                  </p>
                )}

                <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-md overflow-hidden">
                  <iframe
                    src={getEmbedUrl(material.videoUrl)}
                    title={material.topic}
                    className="w-full h-48"
                    frameBorder="0"
                    allowFullScreen
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyMaterialAdmin;
