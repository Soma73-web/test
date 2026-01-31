import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import DataStatusBar from "../../components/DataStatusBar";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

const DownloadAdmin = () => {
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);

  // Fetch downloads data
  const fetchDownloadsData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE}/api/downloads`);
      setDownloads(response.data || []);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Error fetching downloads:", err);
      setError(err.message || "Failed to fetch downloads");
      setDownloads([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchDownloadsData();
  }, [fetchDownloadsData]);

  // Manual refresh function
  const refresh = useCallback(() => {
    fetchDownloadsData();
  }, [fetchDownloadsData]);

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
      toast.error("Please select a file");
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("file", selectedFile);

      await axios.post(`${API_BASE}/api/downloads`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Admin-Auth": "admin-authenticated",
        },
      });

      toast.success("File uploaded successfully");
      resetForm();
      refresh(); // Refresh data immediately
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload file");
    }
  };

  const handleDelete = async (downloadId) => {
    if (!window.confirm("Are you sure you want to delete this file?")) {
      return;
    }

    // Store original state before optimistic update
    const originalDownloads = [...downloads];

    try {
      // Optimistic update - remove from UI immediately
      const updatedDownloads = downloads.filter(d => d.id !== downloadId);
      setDownloads(updatedDownloads);

      await axios.delete(`${API_BASE}/api/downloads/${downloadId}`, {
        headers: { "Admin-Auth": "admin-authenticated" },
      });

      toast.success("File deleted successfully");
      // Don't call refresh() here - the optimistic update is already applied
    } catch (error) {
      console.error("Failed to delete file:", error);
      toast.error("Failed to delete file");
      // Revert optimistic update on error
      setDownloads(originalDownloads);
    }
  };

  const handleDownload = async (downloadId, title) => {
    try {
      const response = await axios.get(`${API_BASE}/api/downloads/file/${downloadId}`, {
        responseType: 'blob',
        headers: { "Admin-Auth": "admin-authenticated" },
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', title || 'download');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download file:", error);
      toast.error("Failed to download file");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Downloads Management</h2>
        <button
          onClick={() => setShowUploadForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
        >
          Upload File
        </button>
      </div>

      {/* Data Status Bar */}
      <DataStatusBar
        lastUpdated={lastUpdated}
        loading={loading}
        error={error}
        onRefresh={refresh}
        dataCount={downloads.length}
        title="Download Files"
      />

      {/* Upload Form */}
      {showUploadForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Upload New File</h3>

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
                  File * (PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, TXT)
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt"
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
                  Upload File
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

      {/* Downloads List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading downloads...</p>
        </div>
      ) : (
        <div className="bg-white border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    File Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {downloads.map((download) => (
                  <tr key={download.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {download.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {download.id}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleDownload(download.id, download.title)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Download
                      </button>
                      <button
                        onClick={() => handleDelete(download.id)}
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

      {!loading && downloads.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No files available for download</p>
        </div>
      )}
    </div>
  );
};

export default DownloadAdmin;
