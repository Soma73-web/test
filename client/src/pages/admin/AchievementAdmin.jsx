import React, { useEffect, useState } from "react";
import api from "../../api";
import { notifyContentUpdate } from "../../hooks/useAutoRefresh";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

const AchievementAdmin = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ id: null, title: "", description: "", image: null });
  const [preview, setPreview] = useState(null);
  const [editing, setEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchAchievements = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/api/achievements");
      setAchievements(res.data || []);
    } catch (err) {
      setError("Failed to load achievements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setForm((prev) => ({ ...prev, image: files[0] }));
      setPreview(files[0] ? URL.createObjectURL(files[0]) : null);
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleEdit = (item) => {
    setForm({ id: item.id, title: item.title, description: item.description || "", image: null });
    setPreview(item.image ? getImageUrl(item.image, item.id) : null);
    setEditing(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this achievement?")) return;
    
    // Store original state before optimistic update
    const originalAchievements = [...achievements];
    
    try {
      // Optimistic update - remove from UI immediately
      const updatedAchievements = achievements.filter(a => a.id !== id);
      setAchievements(updatedAchievements);

      await api.delete(`/api/achievements/${id}`);
      
      // Trigger frontend refresh across all pages
      notifyContentUpdate('content-updated');
      
      // Don't call fetchAchievements() here - the optimistic update is already applied
    } catch {
      alert("Failed to delete achievement");
      // Revert optimistic update on error
      setAchievements(originalAchievements);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      if (form.image) formData.append("image", form.image);
      if (editing && form.id) {
        await api.put(`/api/achievements/${form.id}`, formData);
      } else {
        await api.post("/api/achievements", formData);
      }
      setForm({ id: null, title: "", description: "", image: null });
      setPreview(null);
      setEditing(false);
      fetchAchievements();
      
      // Trigger frontend refresh across all pages
      notifyContentUpdate('content-updated');
    } catch {
      alert("Failed to save achievement");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setForm({ id: null, title: "", description: "", image: null });
    setPreview(null);
    setEditing(false);
  };

  const getImageUrl = (image, id) => {
    if (image && image.startsWith('data:')) return image;
    return `${API_BASE}/api/achievements/${id}/image`;
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Achievements & Appreciation</h2>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleInputChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <input
              type="text"
              name="description"
              value={form.description}
              onChange={handleInputChange}
              className="w-full border px-3 py-2 rounded"
              placeholder="Optional"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Image</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleInputChange}
              className="w-full"
            />
            {preview && (
              <img src={preview} alt="Preview" className="h-24 w-24 rounded-lg mt-2 object-cover border" />
            )}
          </div>
        </div>
        <div className="flex gap-4 mt-2">
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-semibold"
          >
            {editing ? (submitting ? "Updating..." : "Update Achievement") : (submitting ? "Adding..." : "Add Achievement")}
          </button>
          {editing && (
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500 font-semibold"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Achievements List</h3>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : achievements.length === 0 ? (
          <div>No achievements found.</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Image</th>
                <th className="px-4 py-2 text-left">Title</th>
                <th className="px-4 py-2 text-left">Description</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {achievements.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="px-4 py-2">
                    {item.image ? (
                      <img src={getImageUrl(item.image, item.id)} alt={item.title} className="h-20 w-20 rounded-lg object-cover border" />
                    ) : (
                      <span className="text-gray-400">No image</span>
                    )}
                  </td>
                  <td className="px-4 py-2">{item.title}</td>
                  <td className="px-4 py-2">{item.description}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AchievementAdmin; 