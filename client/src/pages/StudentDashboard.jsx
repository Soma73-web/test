import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FiLogOut, FiUser, FiClock, FiShield, FiX } from "react-icons/fi";
import AttendanceCalendar from "../components/AttendanceCalendar";
import TestResults from "../components/TestResults";
import StudyMaterials from "../components/StudyMaterials";

const API_BASE = process.env.REACT_APP_API_BASE_URL;
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

// 3D Logout Confirmation Dialog
const LogoutConfirmationDialog = ({ isOpen, onConfirm, onCancel, sessionTime }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all duration-300 hover:shadow-3xl">
        <div className="flex justify-end mb-4">
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <FiLogOut className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Confirm Logout
          </h3>
          <p className="text-gray-600">
            Are you sure you want to end your session?
          </p>
        </div>

        {sessionTime && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 text-sm text-blue-700">
              <FiClock className="w-4 h-4" />
              <span>Session active for {sessionTime}</span>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={onConfirm}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
          >
            <FiLogOut className="w-5 h-5" />
            Yes, Logout
          </button>
          <button
            onClick={onCancel}
            className="w-full border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-all duration-200"
          >
            Cancel
          </button>
        </div>

        <p className="text-center text-xs text-gray-500 mt-4">
          Your session data will be securely cleared
        </p>
      </div>
    </div>
  );
};

const StudentDashboard = () => {
  const [student, setStudent] = useState(null);
  const [activeTab, setActiveTab] = useState("attendance");
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [sessionTime, setSessionTime] = useState("");
  const [sessionWarning, setSessionWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const activityTimerRef = useRef(null);
  const sessionTimerRef = useRef(null);
  const navigate = useNavigate();

  // Session monitoring
  useEffect(() => {
    const token = localStorage.getItem("studentToken");
    const studentInfo = localStorage.getItem("studentInfo");

    if (!token || !studentInfo) {
      toast.error("Please login to access your dashboard");
      navigate("/student-login");
      return;
    }

    try {
      setStudent(JSON.parse(studentInfo));
      trackSessionTime();
      setupActivityTracking();
      setupSessionTimeout();
    } catch (error) {
      console.error("Error parsing student info:", error);
      navigate("/student-login");
    }

    return () => {
      if (activityTimerRef.current) clearTimeout(activityTimerRef.current);
      if (sessionTimerRef.current) clearInterval(sessionTimerRef.current);
    };
  }, [navigate]);

  // Track active session time
  const trackSessionTime = () => {
    const loginTime = parseInt(localStorage.getItem("loginTimestamp") || Date.now());
    
    const timer = setInterval(() => {
      const elapsed = Date.now() - loginTime;
      const minutes = Math.floor(elapsed / 60000);
      const seconds = Math.floor((elapsed % 60000) / 1000);
      setSessionTime(`${minutes}m ${seconds}s`);
    }, 1000);

    sessionTimerRef.current = timer;
  };

  // Setup activity tracking for session timeout
  const setupActivityTracking = () => {
    const recordActivity = () => {
      localStorage.setItem("lastActivityTime", Date.now().toString());
      resetSessionTimeout();
      setSessionWarning(false);
    };

    const events = ["mousedown", "keypress", "scroll", "touchstart", "click"];
    events.forEach((event) => {
      document.addEventListener(event, recordActivity);
    });

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, recordActivity);
      });
    };
  };

  // Setup session timeout warning
  const setupSessionTimeout = () => {
    resetSessionTimeout();
  };

  const resetSessionTimeout = () => {
    if (activityTimerRef.current) clearTimeout(activityTimerRef.current);

    // Warning at 5 minutes remaining
    const warningTime = SESSION_TIMEOUT - 5 * 60 * 1000;

    activityTimerRef.current = setTimeout(() => {
      setSessionWarning(true);
      showSessionWarning();
    }, warningTime);

    // Auto logout after 30 minutes
    const logoutTimer = setTimeout(() => {
      autoLogout();
    }, SESSION_TIMEOUT);

    return () => clearTimeout(logoutTimer);
  };

  const showSessionWarning = () => {
    let secondsLeft = 300; // 5 minutes
    const interval = setInterval(() => {
      secondsLeft--;
      const mins = Math.floor(secondsLeft / 60);
      const secs = secondsLeft % 60;
      setTimeLeft(`${mins}:${secs.toString().padStart(2, "0")}`);

      if (secondsLeft <= 0) {
        clearInterval(interval);
        autoLogout();
      }
    }, 1000);
  };

  const autoLogout = async () => {
    try {
      const token = localStorage.getItem("studentToken");
      if (token) {
        await axios.post(
          `${API_BASE}/api/students/logout`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
    } catch (error) {
      console.error("Auto logout error:", error);
    } finally {
      clearAllSessionData();
      toast.warning("Session expired due to inactivity. Please login again.");
      navigate("/student-login");
    }
  };

  const handleLogout = () => {
    setShowLogoutDialog(true);
  };

  const confirmLogout = async () => {
    try {
      const token = localStorage.getItem("studentToken");
      if (token) {
        await axios.post(
          `${API_BASE}/api/students/logout`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      clearAllSessionData();
      setShowLogoutDialog(false);
      toast.success("Logged out successfully. See you next time!");
      navigate("/");
    }
  };

  const clearAllSessionData = () => {
    localStorage.removeItem("studentToken");
    localStorage.removeItem("studentInfo");
    localStorage.removeItem("loginTimestamp");
    localStorage.removeItem("lastActivityTime");
    if (activityTimerRef.current) clearTimeout(activityTimerRef.current);
    if (sessionTimerRef.current) clearInterval(sessionTimerRef.current);
  };

  if (!student) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-[96px]">
      {/* Session Warning Banner */}
      {sessionWarning && (
        <div className="bg-red-50 border-b-2 border-red-400 px-4 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FiClock className="w-5 h-5 text-red-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-red-900">
                  Session expiring soon
                </p>
                <p className="text-xs text-red-700">
                  You will be logged out in {timeLeft} due to inactivity
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setSessionWarning(false);
                resetSessionTimeout();
              }}
              className="text-red-600 hover:text-red-800 font-medium text-sm"
            >
              Stay Active
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Student Dashboard
              </h1>
              <p className="text-gray-600 flex items-center gap-2 mt-1">
                <FiUser className="w-4 h-4" />
                Welcome back, {student.firstName} {student.lastName}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <FiLogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Student Info Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 border-l-4 border-blue-500">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="hover:bg-gray-50 p-3 rounded-lg transition">
              <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <FiUser className="w-4 h-4" />
                Student ID
              </h3>
              <p className="text-lg font-bold text-gray-900 mt-1">
                {student.studentId}
              </p>
            </div>
            <div className="hover:bg-gray-50 p-3 rounded-lg transition">
              <h3 className="text-sm font-medium text-gray-500">Course</h3>
              <p className="text-lg font-bold text-gray-900 mt-1">
                {student.course}
              </p>
            </div>
            <div className="hover:bg-gray-50 p-3 rounded-lg transition">
              <h3 className="text-sm font-medium text-gray-500">Batch</h3>
              <p className="text-lg font-bold text-gray-900 mt-1">
                {student.batch}
              </p>
            </div>
            <div className="hover:bg-gray-50 p-3 rounded-lg transition bg-blue-50 border border-blue-200">
              <h3 className="text-sm font-medium text-blue-600 flex items-center gap-2">
                <FiClock className="w-4 h-4" />
                Session Time
              </h3>
              <p className="text-lg font-bold text-blue-900 mt-1 font-mono">
                {sessionTime || "0m 0s"}
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="border-b border-gray-200 bg-gray-50">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab("attendance")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                  activeTab === "attendance"
                    ? "border-blue-600 text-blue-600 bg-blue-50"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                📅 Attendance
              </button>
              <button
                onClick={() => setActiveTab("results")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                  activeTab === "results"
                    ? "border-blue-600 text-blue-600 bg-blue-50"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                📊 Test Results
              </button>
              <button
                onClick={() => setActiveTab("study-materials")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                  activeTab === "study-materials"
                    ? "border-blue-600 text-blue-600 bg-blue-50"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                📚 Study Materials
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "attendance" && (
              <div className="animate-fadeIn">
                <AttendanceCalendar studentId={student.id} />
              </div>
            )}
            {activeTab === "results" && (
              <div className="animate-fadeIn">
                <TestResults studentId={student.id} />
              </div>
            )}
            {activeTab === "study-materials" && (
              <div className="animate-fadeIn">
                <StudyMaterials />
              </div>
            )}
          </div>
        </div>

        {/* Security Info */}
        <div className="mt-8 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
          <FiShield className="w-5 h-5 text-green-600 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-green-900">Your session is secure</p>
            <p className="text-green-700 text-xs">
              Data is encrypted. You'll be automatically logged out after 30 minutes of inactivity.
            </p>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <LogoutConfirmationDialog
        isOpen={showLogoutDialog}
        onConfirm={confirmLogout}
        onCancel={() => setShowLogoutDialog(false)}
        sessionTime={sessionTime}
      />
    </div>
  );
};

export default StudentDashboard;
