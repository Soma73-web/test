import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authManager from "../utils/auth";
import ResultAdmin from "./admin/ResultAdmin";
import GalleryAdmin from "./admin/GalleryAdmin";
import GalleryAdminn from "./admin/GalleryAdminn";
import TestimonialAdmin from "./admin/TestimonialAdmin";
import DownloadAdmin from "./admin/DownloadAdmin";
import SliderAdmin from "./admin/SliderAdmin";
import StudentAdmin from "./admin/StudentAdmin";
import AttendanceAdmin from "./admin/AttendanceAdmin";
import TestResultAdmin from "./admin/TestResultAdmin";
import StudyMaterialAdmin from "./admin/StudyMaterialAdmin";
import AdminLayout from "../components/AdminLayout";
import AnalyticsSummary from "../components/AnalyticsSummary";
import api from "../api";
import AnalyticsTrendsChart from "../components/AnalyticsTrendsChart";
import FacultyAdmin from "./admin/FacultyAdmin";
import AchievementAdmin from "./admin/AchievementAdmin";
import LeadsAdmin from "./admin/LeadsAdmin";

const TABS = [
  { id: "analytics", label: "Analytics", component: null },
  { id: "faculty", label: "Faculty", component: <FacultyAdmin /> },
  { id: "achievements", label: "Achievements", component: <AchievementAdmin /> },
  { id: "slider", label: "Slider", component: <SliderAdmin /> },
  { id: "students", label: "Students", component: <StudentAdmin /> },
  { id: "attendance", label: "Attendance", component: <AttendanceAdmin /> },
  { id: "test-results", label: "Test Results", component: <TestResultAdmin /> },
  { id: "study-materials", label: "Study Materials", component: <StudyMaterialAdmin /> },
  { id: "results", label: "Results", component: <ResultAdmin /> },
  { id: "gallery", label: "Gallery", component: <GalleryAdmin /> },
  {
    id: "gallery-categorized",
    label: "Gallery Categorized",
    component: <GalleryAdminn />,
  },
  {
    id: "testimonials",
    label: "Testimonials",
    component: <TestimonialAdmin />,
  },
  { id: "downloads", label: "Downloads", component: <DownloadAdmin /> },
  { id: "leads", label: "Leads", component: <LeadsAdmin /> },
];

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("slider");
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({ hits: 0, visitors: 0 });
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [analyticsError, setAnalyticsError] = useState(null);
  const [trends, setTrends] = useState([]);
  const [trendsLoading, setTrendsLoading] = useState(true);
  const [trendsError, setTrendsError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuth = async () => {
      const isAuthenticated = await authManager.verifyToken();
      if (!isAuthenticated) {
        navigate("/admin-login");
      } else {
        setLoading(false);
      }
    };
    verifyAuth();
  }, [navigate]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setAnalyticsLoading(true);
      setAnalyticsError(null);
      try {
        const res = await api.get("/api/analytics/summary");
        setAnalytics(res.data || { hits: 0, visitors: 0 });
      } catch (err) {
        setAnalyticsError(err.message || "Failed to load analytics");
      } finally {
        setAnalyticsLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  useEffect(() => {
    const fetchTrends = async () => {
      setTrendsLoading(true);
      setTrendsError(null);
      try {
        const res = await api.get("/api/analytics/trends");
        setTrends(res.data.trends || []);
      } catch (err) {
        setTrendsError(err.message || "Failed to load trends");
      } finally {
        setTrendsLoading(false);
      }
    };
    fetchTrends();
  }, []);

  const renderTabContent = () => {
    if (activeTab === "analytics") {
      return (
        <>
          <div className="mb-8">
            <AnalyticsSummary
              hits={analytics.hits}
              visitors={analytics.visitors}
              loading={analyticsLoading}
              error={analyticsError}
              hitsIncrease={analytics.hitsIncrease}
              hitsPercent={analytics.hitsPercent}
              visitorsIncrease={analytics.visitorsIncrease}
              visitorsPercent={analytics.visitorsPercent}
            />
          </div>
          <div className="mb-8">
            <AnalyticsTrendsChart trends={trends} loading={trendsLoading} error={trendsError} />
          </div>
        </>
      );
    }
    const tab = TABS.find((t) => t.id === activeTab);
    return tab?.component || null;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg">Verifying authentication...</div>
      </div>
    );
  }

  return (
    <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab} navigationItems={TABS}>
      {renderTabContent()}
    </AdminLayout>
  );
};

export default AdminPanel;
