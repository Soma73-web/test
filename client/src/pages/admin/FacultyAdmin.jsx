import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import DataStatusBar from "../../components/DataStatusBar";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

const FacultyAdmin = () => {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    education: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);

  // Fetch faculty data
  const fetchFacultyData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE}/api/faculty`);
      setFaculty(response.data || []);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Error fetching faculty:", err);
      setError(err.message || "Failed to fetch faculty");
      setFaculty([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchFacultyData();
  }, [fetchFacultyData]);

  // Manual refresh function
  const refresh = useCallback(() => {
    fetchFacultyData();
  }, [fetchFacultyData]);

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
      name: "",
      subject: "",
      education: "",
    });
    setSelectedFile(null);
    setEditingFaculty(null);
    setShowCreateForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("subject", formData.subject);
      formDataToSend.append("education", formData.education);
      if (selectedFile) {
        formDataToSend.append("photo", selectedFile);
      }

      if (editingFaculty) {
        await axios.put(
          `${API_BASE}/api/faculty/${editingFaculty.id}`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              "Admin-Auth": "admin-authenticated",
            },
          }
        );
        toast.success("Faculty updated successfully");
      } else {
        await axios.post(`${API_BASE}/api/faculty`, formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
            "Admin-Auth": "admin-authenticated",
          },
        });
        toast.success("Faculty created successfully");
      }

      resetForm();
      refresh(); // Refresh data immediately
    } catch (error) {
      console.error("Error saving faculty:", error);
      toast.error("Failed to save faculty");
    }
  };

  const handleEdit = (facultyMember) => {
    setEditingFaculty(facultyMember);
    setFormData({
      name: facultyMember.name,
      subject: facultyMember.subject,
      education: facultyMember.education || "",
    });
    setShowCreateForm(true);
  };

  const handleDelete = async (facultyId) => {
    if (!window.confirm("Are you sure you want to delete this faculty member?")) {
      return;
    }

    // Store original state before optimistic update
    const originalFaculty = [...faculty];

    try {
      // Optimistic update - remove from UI immediately
      const updatedFaculty = faculty.filter(f => f.id !== facultyId);
      setFaculty(updatedFaculty);

      await axios.delete(`${API_BASE}/api/faculty/${facultyId}`, {
        headers: { "Admin-Auth": "admin-authenticated" },
      });

      toast.success("Faculty deleted successfully");
      // Don't call refresh() here - the optimistic update is already applied
    } catch (error) {
      console.error("Failed to delete faculty:", error);
      toast.error("Failed to delete faculty");
      // Revert optimistic update on error
      setFaculty(originalFaculty);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Faculty Management</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
        >
          Add New Faculty
        </button>
      </div>

      {/* Data Status Bar */}
      <DataStatusBar
        lastUpdated={lastUpdated}
        loading={loading}
        error={error}
        onRefresh={refresh}
        dataCount={faculty.length}
        title="Faculty Members"
      />

      {/* Create/Edit Faculty Form */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {editingFaculty ? "Edit Faculty" : "Add New Faculty"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Education
                  </label>
                  <textarea
                    name="education"
                    value={formData.education}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Photo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
                >
                  {editingFaculty ? "Update Faculty" : "Create Faculty"}
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

      {/* Faculty List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading faculty...</p>
        </div>
      ) : (
        <div className="bg-white border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Faculty Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Education
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {faculty.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={`${API_BASE}/api/faculty/${member.id}/photo`}
                            alt={member.name}
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/40x40?text=No+Photo";
                            }}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {member.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{member.subject}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {member.education || "Not specified"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEdit(member)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(member.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyAdmin; 