import React, { useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAutoRefresh } from "../hooks/useAutoRefresh";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

const AttendanceCalendar = ({ studentId }) => {
  const [attendance, setAttendance] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [hoveredDate, setHoveredDate] = useState(null);

  const fetchAttendance = useCallback(async (refreshType = 'initial') => {
    setLoading(true);
    try {
      console.log(`Fetching attendance (${refreshType})...`);
      const token = localStorage.getItem("studentToken");
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();

      const response = await axios.get(
        `${API_BASE}/api/students/${studentId}/attendance?month=${month}&year=${year}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setAttendance(response.data);
    } catch (error) {
      console.error("Failed to fetch attendance:", error);
      toast.error("Failed to load attendance data");
    } finally {
      setLoading(false);
    }
  }, [currentDate, studentId]);

  // Use the auto-refresh hook
  useAutoRefresh(fetchAttendance, [currentDate, studentId], 30000);

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getAttendanceForDate = (day) => {
    const dateString = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day,
    )
      .toISOString()
      .split("T")[0];
    return attendance.find((att) => att.date === dateString);
  };

  const changeMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-12"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const attendanceRecord = getAttendanceForDate(day);
      let dayClass =
        "h-12 w-12 flex items-center justify-center rounded-lg cursor-pointer relative ";

      if (attendanceRecord) {
        if (attendanceRecord.status === "present") {
          dayClass += "bg-green-500 text-white hover:bg-green-600";
        } else if (attendanceRecord.status === "absent") {
          dayClass += "bg-red-500 text-white hover:bg-red-600";
        } else if (attendanceRecord.status === "late") {
          dayClass += "bg-yellow-500 text-white hover:bg-yellow-600";
        }
      } else {
        dayClass += "bg-gray-100 text-gray-500 hover:bg-gray-200";
      }

      days.push(
        <div
          key={day}
          className={dayClass}
          onMouseEnter={() => setHoveredDate(attendanceRecord)}
          onMouseLeave={() => setHoveredDate(null)}
        >
          {day}
          {hoveredDate &&
            hoveredDate.date === getAttendanceForDate(day)?.date &&
            hoveredDate.status === "absent" &&
            hoveredDate.reason && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap z-10">
                {hoveredDate.reason}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
              </div>
            )}
        </div>,
      );
    }

    return days;
  };

  const getAttendanceStats = () => {
    const present = attendance.filter((att) => att.status === "present").length;
    const absent = attendance.filter((att) => att.status === "absent").length;
    const late = attendance.filter((att) => att.status === "late").length;
    const total = attendance.length;
    const percentage =
      total > 0 ? (((present + late * 0.5) / total) * 100).toFixed(1) : 0;

    return { present, absent, late, total, percentage };
  };

  const stats = getAttendanceStats();

  return (
    <div className="space-y-6">
      {/* Month Navigation */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          {currentDate.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => changeMonth(-1)}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={() => changeMonth(1)}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Attendance Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-green-600 text-2xl font-bold">
            {stats.present}
          </div>
          <div className="text-green-600 text-sm">Present</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="text-red-600 text-2xl font-bold">{stats.absent}</div>
          <div className="text-red-600 text-sm">Absent</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="text-yellow-600 text-2xl font-bold">{stats.late}</div>
          <div className="text-yellow-600 text-sm">Late</div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-blue-600 text-2xl font-bold">
            {stats.percentage}%
          </div>
          <div className="text-blue-600 text-sm">Attendance</div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span>Present</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span>Absent</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-500 rounded"></div>
          <span>Late</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-100 rounded"></div>
          <span>No Record</span>
        </div>
      </div>

      {/* Calendar */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading attendance...</p>
        </div>
      ) : (
        <div className="bg-white">
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="h-12 flex items-center justify-center font-medium text-gray-500"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">{renderCalendar()}</div>
        </div>
      )}

      <div className="text-sm text-gray-600">
        <p>💡 Hover over absent days to see the reason</p>
      </div>
    </div>
  );
};

export default AttendanceCalendar;
