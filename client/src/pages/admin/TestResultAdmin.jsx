import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

const TestResultAdmin = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    studentId: "",
    testNumber: "",
    testName: "",
    subject: "",
    maxMarks: "",
    obtainedMarks: "",
    testDate: "",
    remarks: "",
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/admin/students`, {
        headers: { "Admin-Auth": "admin-authenticated" },
      });
      setStudents(response.data.filter((student) => student.isActive));
    } catch (error) {
      console.error("Failed to fetch students:", error);
      toast.error("Failed to load students");
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setFormData({
      studentId: "",
      testNumber: "",
      testName: "",
      subject: "",
      maxMarks: "",
      obtainedMarks: "",
      testDate: "",
      remarks: "",
    });
    setShowAddForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(
        `${API_BASE}/api/admin/test-results`,
        {
          ...formData,
          studentId: parseInt(formData.studentId),
          testNumber: parseInt(formData.testNumber),
          maxMarks: parseInt(formData.maxMarks),
          obtainedMarks: parseInt(formData.obtainedMarks),
        },
        { headers: { "Admin-Auth": "admin-authenticated" } },
      );

      toast.success("Test result added successfully");
      resetForm();
    } catch (error) {
      console.error("Failed to add test result:", error);
      const errorMessage =
        error.response?.data?.error || "Failed to add test result";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const addBulkResults = () => {
    setShowAddForm(false);
    // You could implement a bulk upload feature here
    toast.info("Bulk upload feature can be implemented here");
  };

  const getSelectedStudent = () => {
    return students.find((s) => s.id === parseInt(formData.studentId));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Test Results Management
        </h2>
        <div className="flex gap-3">
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
          >
            Add Test Result
          </button>
          <button
            onClick={addBulkResults}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium"
          >
            Bulk Upload
          </button>
        </div>
      </div>

      {/* Add Test Result Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Add Test Result</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Student *
                  </label>
                  <select
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Student</option>
                    {students.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.firstName} {student.lastName} (
                        {student.studentId})
                      </option>
                    ))}
                  </select>
                  {getSelectedStudent() && (
                    <p className="text-sm text-gray-600 mt-1">
                      Course: {getSelectedStudent().course} | Batch:{" "}
                      {getSelectedStudent().batch}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Test Number *
                  </label>
                  <input
                    type="number"
                    name="testNumber"
                    value={formData.testNumber}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Test Name *
                  </label>
                  <input
                    type="text"
                    name="testName"
                    value={formData.testName}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Unit Test 1"
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
                    placeholder="e.g., Physics"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Test Date *
                  </label>
                  <input
                    type="date"
                    name="testDate"
                    value={formData.testDate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Maximum Marks *
                  </label>
                  <input
                    type="number"
                    name="maxMarks"
                    value={formData.maxMarks}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Obtained Marks *
                  </label>
                  <input
                    type="number"
                    name="obtainedMarks"
                    value={formData.obtainedMarks}
                    onChange={handleInputChange}
                    required
                    min="0"
                    max={formData.maxMarks || undefined}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  {formData.maxMarks && formData.obtainedMarks && (
                    <p className="text-sm text-gray-600 mt-1">
                      Percentage:{" "}
                      {(
                        (formData.obtainedMarks / formData.maxMarks) *
                        100
                      ).toFixed(1)}
                      %
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Remarks
                  </label>
                  <textarea
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Any additional comments about the test performance"
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
                  {loading ? "Adding..." : "Add Test Result"}
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

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900 mb-2">Instructions</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>
            • Add test results for individual students using the "Add Test
            Result" button
          </li>
          <li>
            • Use "Bulk Upload" for adding multiple results at once (feature can
            be implemented)
          </li>
          <li>
            • Grades are automatically calculated based on percentage: A+
            (90%+), A (80-89%), B+ (70-79%), B (60-69%), C (50-59%), D (40-49%),
            F (below 40%)
          </li>
          <li>
            • Test numbers help organize multiple tests - students can filter by
            test number in their dashboard
          </li>
        </ul>
      </div>

      {/* Recent Activity or Summary could go here */}
      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Stats</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-blue-600 text-2xl font-bold">
              {students.length}
            </div>
            <div className="text-blue-600 text-sm">Active Students</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-green-600 text-2xl font-bold">-</div>
            <div className="text-green-600 text-sm">Tests Added Today</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-purple-600 text-2xl font-bold">-</div>
            <div className="text-purple-600 text-sm">Average Class Score</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestResultAdmin;
