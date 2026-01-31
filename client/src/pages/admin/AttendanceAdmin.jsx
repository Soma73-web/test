import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

const AttendanceAdmin = () => {
  const [students, setStudents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [attendanceData, setAttendanceData] = useState({});
  const [loading, setLoading] = useState(false);

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

  const handleAttendanceChange = (studentId, field, value) => {
    setAttendanceData((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value,
      },
    }));
  };

  const markAllPresent = () => {
    const newAttendanceData = {};
    students.forEach((student) => {
      newAttendanceData[student.id] = {
        status: "present",
        reason: "",
      };
    });
    setAttendanceData(newAttendanceData);
  };

  const markAllAbsent = () => {
    const newAttendanceData = {};
    students.forEach((student) => {
      newAttendanceData[student.id] = {
        status: "absent",
        reason: "",
      };
    });
    setAttendanceData(newAttendanceData);
  };

  const submitAttendance = async () => {
    setLoading(true);
    let successCount = 0;
    let errorCount = 0;

    for (const student of students) {
      const attendance = attendanceData[student.id];
      if (attendance && attendance.status) {
        try {
          await axios.post(
            `${API_BASE}/api/admin/attendance`,
            {
              studentId: student.id,
              date: selectedDate,
              status: attendance.status,
              reason: attendance.reason || null,
            },
            { headers: { "Admin-Auth": "admin-authenticated" } },
          );
          successCount++;
        } catch (error) {
          console.error(
            `Failed to mark attendance for ${student.firstName}:`,
            error,
          );
          errorCount++;
        }
      }
    }

    setLoading(false);

    if (successCount > 0) {
      toast.success(`Attendance marked for ${successCount} students`);
    }
    if (errorCount > 0) {
      toast.error(`Failed to mark attendance for ${errorCount} students`);
    }

    // Clear attendance data after submission
    setAttendanceData({});
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "present":
        return "bg-green-100 text-green-800 border-green-300";
      case "absent":
        return "bg-red-100 text-red-800 border-red-300";
      case "late":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">
          Attendance Management
        </h2>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Date
            </label>
            <input
              type="date"
              id="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={markAllPresent}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              Mark All Present
            </button>
            <button
              onClick={markAllAbsent}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              Mark All Absent
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white border rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b">
          <h3 className="text-lg font-medium text-gray-900">
            Attendance for{" "}
            {new Date(selectedDate).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </h3>
        </div>

        <div className="divide-y divide-gray-200">
          {students.map((student) => {
            const attendance = attendanceData[student.id] || {};
            return (
              <div key={student.id} className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="flex-1">
                    <h4 className="text-lg font-medium text-gray-900">
                      {student.firstName} {student.lastName}
                    </h4>
                    <p className="text-sm text-gray-500">
                      ID: {student.studentId} | {student.course} | Batch:{" "}
                      {student.batch}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        value={attendance.status || ""}
                        onChange={(e) =>
                          handleAttendanceChange(
                            student.id,
                            "status",
                            e.target.value,
                          )
                        }
                        className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm font-medium ${getStatusColor(attendance.status)}`}
                      >
                        <option value="">Select Status</option>
                        <option value="present">Present</option>
                        <option value="absent">Absent</option>
                        <option value="late">Late</option>
                      </select>
                    </div>

                    {attendance.status === "absent" && (
                      <div className="flex-1 min-w-[200px]">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Reason for Absence
                        </label>
                        <input
                          type="text"
                          value={attendance.reason || ""}
                          onChange={(e) =>
                            handleAttendanceChange(
                              student.id,
                              "reason",
                              e.target.value,
                            )
                          }
                          placeholder="Enter reason (optional)"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {Object.keys(attendanceData).length} of {students.length} students
              marked
            </div>
            <button
              onClick={submitAttendance}
              disabled={loading || Object.keys(attendanceData).length === 0}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg font-medium"
            >
              {loading ? "Submitting..." : "Submit Attendance"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceAdmin;
