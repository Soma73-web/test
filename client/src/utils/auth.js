import axios from "axios";

class AuthManager {
  constructor() {
    this.activityTimer = null;
    this.logoutTimer = null;
    this.setupActivityTracking();
  }

  setupActivityTracking() {
    // Track user activity (mouse movement, clicks, keystrokes)
    const activities = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click",
    ];

    const resetTimers = () => {
      this.resetInactivityTimer();
    };

    activities.forEach((activity) => {
      document.addEventListener(activity, resetTimers, true);
    });
  }

  resetInactivityTimer() {
    // Clear existing timer
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
    }

    // Only set timer if admin is logged in
    const token = localStorage.getItem("admin_token");
    if (!token) return;

    // Set new timer for 30 minutes (1800000 ms)
    this.logoutTimer = setTimeout(() => {
      this.autoLogout();
    }, 1800000);
  }

  autoLogout() {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_logged_in");
    localStorage.removeItem("admin_info");

    // Only redirect to /admin-login if on an admin route
    const path = window.location.pathname;
    const isAdminRoute = path.startsWith("/admin") && path !== "/";
    if (isAdminRoute || path === "/admin-login") {
      window.location.href = "/admin-login";
    } else {
      // On public routes, do not show any alert or toast for admin session expiration
      // (Fix: previously showed alert/toast on home page and public pages)
    }
  }

  setToken(token) {
    localStorage.setItem("admin_token", token);
    this.resetInactivityTimer();
  }

  getToken() {
    return localStorage.getItem("admin_token");
  }

  removeToken() {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_logged_in");
    localStorage.removeItem("admin_info");

    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
    }
  }

  isAuthenticated() {
    return !!this.getToken();
  }

  async verifyToken() {
    const token = this.getToken();
    if (!token) return false;

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/auth/verify`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (res.status === 200) {
        this.resetInactivityTimer();
        return true;
      }
    } catch (error) {
      this.removeToken();
      return false;
    }

    return false;
  }

  setupAxiosInterceptors() {
    // Add token to all requests
    axios.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    // Handle token expiration
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.autoLogout();
        }
        return Promise.reject(error);
      },
    );
  }
}

// Create singleton instance
const authManager = new AuthManager();

export default authManager;
