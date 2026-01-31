import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAutoRefresh } from "../../hooks/useAutoRefresh";
import DataStatusBar from "../../components/DataStatusBar";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

const StudentAdmin = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    studentId: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    dateOfBirth: "",
    course: "",
    batch: "",
  });



  // Temporary: Use simple state instead of auto-refresh for debugging
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Simple fetch function
  const fetchStudentsData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE}/api/admin/students`, {
        headers: { "Admin-Auth": "admin-authenticated" },
      });
      setStudents(response.data || []);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Error fetching students:", err);
      setError(err.message || "Failed to fetch students");
      setStudents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchStudentsData();
  }, [fetchStudentsData]);

  // Manual refresh function
  const refresh = useCallback(() => {
    fetchStudentsData();
  }, [fetchStudentsData]);

  // Ensure students is always an array
  const studentsArray = students || [];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setFormData({
      studentId: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phone: "",
      dateOfBirth: "",
      course: "",
      batch: "",
    });
    setEditingStudent(null);
    setShowCreateForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingStudent) {
        // Update existing student
        await axios.put(
          `${API_BASE}/api/admin/students/${editingStudent.id}`,
          formData,
          { headers: { "Admin-Auth": "admin-authenticated" } },
        );
        toast.success("Student updated successfully");
      } else {
        // Create new student
        await axios.post(`${API_BASE}/api/admin/students`, formData, {
          headers: { "Admin-Auth": "admin-authenticated" },
        });
        toast.success("Student created successfully");
      }
      resetForm();
      refresh(); // Refresh data immediately
    } catch (error) {
      console.error("Student operation failed:", error);
      const errorMessage = error.response?.data?.error || "Operation failed";
      toast.error(errorMessage);
    }
  };

  const handleEdit = (student) => {
    setFormData({
      studentId: student.studentId,
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      password: "", // Don't pre-fill password
      phone: student.phone || "",
      dateOfBirth: student.dateOfBirth ? student.dateOfBirth.split("T")[0] : "",
      course: student.course,
      batch: student.batch,
    });
    setEditingStudent(student);
    setShowCreateForm(true);
  };

  const handleDelete = async (studentId) => {
    if (!window.confirm("Are you sure you want to permanently delete this student? This action cannot be undone.")) {
      return;
    }

    // Store original state before optimistic update
    const originalStudents = [...studentsArray];

    try {
      // Optimistic update - remove from UI immediately
      const updatedStudents = studentsArray.filter(s => s.id !== studentId);
      setStudents(updatedStudents);
      
      // Make API call to actually delete
      await axios.delete(`${API_BASE}/api/admin/students/${studentId}`, {
        headers: { "Admin-Auth": "admin-authenticated" },
      });
      
      toast.success("Student deleted successfully");
      // Don't call refresh() here - the optimistic update is already applied
    } catch (error) {
      console.error("Failed to delete student:", error);
      toast.error("Failed to delete student");
      // Revert optimistic update on error
      setStudents(originalStudents);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Student Management</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
        >
          Add New Student
        </button>
      </div>

      {/* Create/Edit Student Form */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {editingStudent ? "Edit Student" : "Create New Student"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Student ID *
                  </label>
                  <input
                    type="text"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password{" "}
                    {editingStudent ? "(leave empty to keep current)" : "*"}
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required={!editingStudent}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course *
                  </label>
                  <input
                    type="text"
                    name="course"
                    value={formData.course}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., NEET Preparation"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Batch *
                  </label>
                  <input
                    type="text"
                    name="batch"
                    value={formData.batch}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., 2024-25"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg font-medium"
                >
                  {loading
                    ? "Saving..."
                    : editingStudent
                      ? "Update Student"
                      : "Create Student"}
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

      {/* Data Status Bar */}
      <DataStatusBar
        lastUpdated={lastUpdated}
        loading={loading}
        error={error}
        onRefresh={refresh}
        dataCount={studentsArray.length}
        title="Students"
      />

      {/* Students List */}
      {loading && !showCreateForm ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading students...</p>
        </div>
      ) : (
        <div className="bg-white border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course & Batch
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {studentsArray.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {student.firstName} {student.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {student.studentId}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {student.email}
                      </div>
                      <div className="text-sm text-gray-500">
                        {student.phone || "No phone"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {student.course}
                      </div>
                      <div className="text-sm text-gray-500">
                        Batch: {student.batch}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEdit(student)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(student.id)}
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

export default StudentAdmin;
