import React, { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import authManager from "../utils/auth";
import LoadingSpinner from "./LoadingSpinner";

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = authManager.getToken();

        if (!token) {
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        const isValid = await authManager.verifyToken();
        setIsAuthenticated(isValid);
      } catch (error) {
        console.error("Auth verification failed:", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner size="lg" text="Verifying authentication..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page and save the attempted location
    return <Navigate to="/admin-login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
