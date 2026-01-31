import React from "react";
import { useNavigate } from "react-router-dom";
import authManager from "../utils/auth";
import BuildInfo from "./BuildInfo";

const AdminLayout = ({ children, activeTab, setActiveTab, navigationItems }) => {
  const defaultNavigationItems = [
    { id: "slider", label: "Slider" },
    { id: "students", label: "Students" },
    { id: "attendance", label: "Attendance" },
    { id: "test-results", label: "Test Results" },
    { id: "study-materials", label: "Study Materials" },
    { id: "popup", label: "Popup" },
    { id: "results", label: "Results" },
    { id: "gallery", label: "Gallery" },
    { id: "gallery-categorized", label: "Gallery Categorized" },
    { id: "testimonials", label: "Testimonials" },
    { id: "downloads", label: "Downloads" },
  ];
  const navItems = navigationItems || defaultNavigationItems;

  const navigate = useNavigate();
  const handleLogout = () => {
    authManager.removeToken();
    navigate('/admin-login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-yellow-50 flex flex-col items-center justify-start py-8 px-2 sm:px-0">
      {/* Top Navigation Bar */}
      <div className="w-full max-w-6xl rounded-3xl bg-white/80 shadow flex flex-col items-center mb-8 border border-gray-200">
        <div className="flex flex-col sm:flex-row items-center justify-between w-full px-8 pt-6 pb-2">
          <div className="text-2xl font-bold text-blue-700 mb-4 sm:mb-0 select-none">Admin Panel</div>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-full font-semibold text-sm transition-colors"
          >
            Logout
          </button>
        </div>
        {/* Horizontal Tabs */}
        <nav className="flex flex-wrap gap-2 w-full px-4 pb-4 overflow-x-auto no-scrollbar">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-5 py-2 rounded-full font-medium text-sm transition-colors border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                activeTab === item.id
                  ? "bg-blue-600 text-white shadow"
                  : "bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-700"
              }`}
              tabIndex={0}
              aria-current={activeTab === item.id ? "page" : undefined}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
      {/* Main Content Card */}
      <main className="w-full max-w-5xl bg-white rounded-3xl shadow-xl p-8 sm:p-12 flex flex-col items-stretch border border-gray-200">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {navItems.find(item => item.id === activeTab)?.label || "Admin Dashboard"}
          </h1>
        </header>
        <section className="w-full flex flex-col items-center justify-center">
          {children}
        </section>
        <div className="mt-12">
          <BuildInfo />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout; 