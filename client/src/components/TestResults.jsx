import React, { useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAutoRefresh } from "../hooks/useAutoRefresh";
import logger from "../utils/logger";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

const TestResults = ({ studentId }) => {
  const [testResults, setTestResults] = useState([]);
  const [availableTests, setAvailableTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState("");
  const [loading, setLoading] = useState(true);

  // Use the auto-refresh hook for available tests
  useAutoRefresh(() => {
    fetchAvailableTests();
  }, [studentId], 30000);

  // Use the auto-refresh hook for test results
  useAutoRefresh(() => {
    if (selectedTest) {
      fetchTestResults();
    } else {
      fetchAllTestResults();
    }
  }, [selectedTest, studentId], 30000);

  const fetchAvailableTests = useCallback(async (refreshType = 'initial') => {
    try {
      logger.log(`Fetching available tests (${refreshType})...`);
      const token = localStorage.getItem("studentToken");
      const response = await axios.get(
        `${API_BASE}/api/students/${studentId}/available-tests`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setAvailableTests(response.data);
    } catch (error) {
      logger.error("Failed to fetch available tests:", error);
      toast.error("Failed to load test information");
    }
  }, [studentId]);

  const fetchTestResults = useCallback(async (refreshType = 'initial') => {
    setLoading(true);
    try {
      logger.log(`Fetching test results (${refreshType})...`);
      const token = localStorage.getItem("studentToken");
      const url = selectedTest
        ? `${API_BASE}/api/students/${studentId}/test-results?testNumber=${selectedTest}`
        : `${API_BASE}/api/students/${studentId}/test-results`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTestResults(response.data);
    } catch (error) {
      logger.error("Failed to fetch test results:", error);
      toast.error("Failed to load test results");
    } finally {
      setLoading(false);
    }
  }, [selectedTest, studentId]);

  const fetchAllTestResults = useCallback(async (refreshType = 'initial') => {
    setLoading(true);
    try {
      const token = localStorage.getItem("studentToken");
      const response = await axios.get(
        `${API_BASE}/api/students/${studentId}/test-results`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setTestResults(response.data);
    } catch (error) {
      logger.error("Failed to fetch test results:", error);
      toast.error("Failed to load test results");
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  const getGradeColor = (grade) => {
    switch (grade) {
      case "A+":
      case "A":
        return "text-green-600 bg-green-100";
      case "B+":
      case "B":
        return "text-blue-600 bg-blue-100";
      case "C":
        return "text-yellow-600 bg-yellow-100";
      case "D":
        return "text-orange-600 bg-orange-100";
      default:
        return "text-red-600 bg-red-100";
    }
  };

  const calculateOverallStats = () => {
    if (testResults.length === 0)
      return { avgPercentage: 0, totalTests: 0, bestGrade: "N/A" };

    const totalPercentage = testResults.reduce(
      (sum, result) => sum + parseFloat(result.percentage),
      0,
    );
    const avgPercentage = (totalPercentage / testResults.length).toFixed(1);

    const grades = testResults.map((result) => result.grade);
    const gradeOrder = ["A+", "A", "B+", "B", "C", "D", "F"];
    const bestGrade =
      gradeOrder.find((grade) => grades.includes(grade)) || "N/A";

    return {
      avgPercentage,
      totalTests: testResults.length,
      bestGrade,
    };
  };

  const stats = calculateOverallStats();

  return (
    <div className="space-y-6">
      {/* Test Filter */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Test Results</h3>
        <div className="flex gap-4 items-center">
          <label
            htmlFor="testSelect"
            className="text-sm font-medium text-gray-700"
          >
            Filter by Test:
          </label>
          <select
            id="testSelect"
            value={selectedTest}
            onChange={(e) => setSelectedTest(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="">All Tests</option>
            {availableTests.map((test) => (
              <option key={test.testNumber} value={test.testNumber}>
                Test {test.testNumber} - {test.testName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-blue-600 text-2xl font-bold">
            {stats.avgPercentage}%
          </div>
          <div className="text-blue-600 text-sm">Average Score</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-green-600 text-2xl font-bold">
            {stats.totalTests}
          </div>
          <div className="text-green-600 text-sm">Total Tests</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-purple-600 text-2xl font-bold">
            {stats.bestGrade}
          </div>
          <div className="text-purple-600 text-sm">Best Grade</div>
        </div>
      </div>

      {/* Test Results Table */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading test results...</p>
        </div>
      ) : testResults.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 text-6xl mb-4">📊</div>
          <p className="text-gray-600">No test results found</p>
          {selectedTest && (
            <p className="text-sm text-gray-500 mt-2">
              Try selecting a different test or view all tests
            </p>
          )}
        </div>
      ) : (
        <div className="bg-white border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Test Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Remarks
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {testResults.map((result) => (
                  <tr key={result.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          Test {result.testNumber}
                        </div>
                        <div className="text-sm text-gray-500">
                          {result.testName}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {result.subject}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {result.obtainedMarks}/{result.maxMarks}
                      </div>
                      <div className="text-sm text-gray-500">
                        {result.percentage}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getGradeColor(result.grade)}`}
                      >
                        {result.grade}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(result.testDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                      {result.remarks || "-"}
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

export default TestResults;
