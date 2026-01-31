import React, { useState, useEffect, Suspense, lazy, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SiteLoader from "./components/SiteLoader";
import ErrorBoundary from "./components/ErrorBoundary";
import authManager from "./utils/auth";

import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToHash from "./components/ScrollToHash";
import WhatsAppButton from "./components/WhatsAppButton";
import AIChatbot from "./components/AIChatbot";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";
import BackToTop from "./components/BackToTop";
import LeadPopup from "./components/LeadPopup";
import SearchLoader from "./components/SearchLoader";

// Homepage Components
import HomeSlider from "./components/HomeSlider";
import Hero from "./components/Hero";
import Courses from "./components/Courses";
import Features from "./components/Features";
import Results from "./components/Results";
import Gallery from "./components/Gallery";
import Testimonials from "./components/Testimonials";
import Events from "./components/Events";

// Lazy load major pages/components
const GallerySection = lazy(() => import("./components/GallerySection"));
const DownloadSection = lazy(() => import("./components/DownloadSection"));
const DirectorsMessage = lazy(() => import("./pages/DirectorsMessage"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const AdminPanel = lazy(() => import("./pages/AdminPanel"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const About = lazy(() => import("./pages/About"));
const ResultsPage = lazy(() => import("./pages/ResultsPage"));
const StudentLogin = lazy(() => import("./pages/StudentLogin"));
const StudentDashboard = lazy(() => import("./pages/StudentDashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));

function App() {
  const [loading, setLoading] = useState(true);
  const [showLeadPopup, setShowLeadPopup] = useState(false);

  useEffect(() => {
    // Setup auth manager interceptors
    authManager.setupAxiosInterceptors();

    // Show popup after 5 seconds
    const timer = setTimeout(() => {
      setLoading(false);
      setShowLeadPopup(true);
    }, 5000); // Show popup after 5 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleCloseLeadPopup = useCallback(() => {
    setShowLeadPopup(false);
  }, []);

  if (loading) {
    return <SearchLoader />;
  }

  return (
    <ErrorBoundary>
      <Router>
        <ScrollToTop />
        <ScrollToHash />
        <BackToTop />
        <Suspense fallback={<SearchLoader />}> {/* Suspense for lazy routes */}
        {/* Only show public UI on non-admin pages */}
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Header />
                <WhatsAppButton />
                <AIChatbot />
                <main className="pt-[96px]">
                  <HomeSlider />
                  {/* <Events /> removed as per user request */}
                  <Hero />
                  {/* Courses Section */}
                  <div id="courses" className="scroll-mt-24">
                    <Courses />
                  </div>
                  <Features />
                  <Results />
                  <Gallery />
                  {/* Testimonials Section */}
                  <div id="testimonials" className="scroll-mt-24">
                    <Testimonials />
                  </div>
                </main>
                <Footer />
                <LeadPopup isOpen={showLeadPopup} onClose={handleCloseLeadPopup} />
              </>
            }
          />

          {/* Other Pages */}
          <Route path="/gallery" element={<><Header /><GallerySection /><Footer /></>} />
          <Route path="/downloads" element={<><Header /><DownloadSection /><Footer /></>} />
          <Route path="/directors-message" element={<><Header /><DirectorsMessage /><Footer /></>} />
          <Route path="/privacy-policy" element={<><Header /><PrivacyPolicy /><Footer /></>} />
          <Route path="/contact" element={<><Header /><ContactPage /><Footer /></>} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            }
          />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/about" element={<><Header /><About /><Footer /></>} />
          <Route path="/results" element={<><Header /><ResultsPage /><Footer /></>} />
          <Route path="/student-login" element={<><Header /><StudentLogin /><Footer /></>} />
          <Route path="/student-dashboard" element={<><Header /><StudentDashboard /><Footer /></>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </Router>
    </ErrorBoundary>
  );
}

export default App;
