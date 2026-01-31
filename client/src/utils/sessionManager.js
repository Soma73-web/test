/**
 * Session Manager - Handles student session lifecycle
 * Features:
 * - Session timeout tracking
 * - Activity monitoring
 * - Automatic logout
 * - Session renewal
 */

const SESSION_CONFIG = {
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  WARNING_TIME: 5 * 60 * 1000, // 5 minutes before timeout
  ACTIVITY_DEBOUNCE: 1000, // 1 second debounce for activity tracking
};

class SessionManager {
  constructor() {
    this.sessionTimers = {};
    this.activityListeners = [];
    this.isInitialized = false;
  }

  /**
   * Initialize session management
   */
  init() {
    if (this.isInitialized) return;
    this.isInitialized = true;
    this.setupActivityTracking();
  }

  /**
   * Setup activity tracking with debouncing
   */
  setupActivityTracking() {
    let activityTimeout = null;

    const recordActivity = () => {
      if (activityTimeout) return;

      // Debounce activity recording
      activityTimeout = setTimeout(() => {
        activityTimeout = null;
      }, SESSION_CONFIG.ACTIVITY_DEBOUNCE);

      this.recordActivity();
      this.notifyActivityListeners();
    };

    const events = [
      "mousedown",
      "keypress",
      "scroll",
      "touchstart",
      "click",
      "mousemove",
    ];

    events.forEach((event) => {
      document.addEventListener(event, recordActivity);
    });
  }

  /**
   * Record activity timestamp
   */
  recordActivity() {
    localStorage.setItem("lastActivityTime", Date.now().toString());
  }

  /**
   * Start session monitoring for a student
   */
  startSession(studentId, onWarning, onTimeout) {
    const sessionKey = `session_${studentId}`;

    this.sessionTimers[sessionKey] = {
      warningShown: false,
      onWarning,
      onTimeout,
    };

    this.resetSessionTimer(studentId);
  }

  /**
   * Reset session timer
   */
  resetSessionTimer(studentId) {
    const sessionKey = `session_${studentId}`;
    const config = this.sessionTimers[sessionKey];

    if (!config) return;

    // Clear existing timers
    if (config.warningTimer) clearTimeout(config.warningTimer);
    if (config.logoutTimer) clearTimeout(config.logoutTimer);

    // Set warning timer
    config.warningTimer = setTimeout(() => {
      if (config.onWarning) {
        config.onWarning();
      }
    }, SESSION_CONFIG.SESSION_TIMEOUT - SESSION_CONFIG.WARNING_TIME);

    // Set logout timer
    config.logoutTimer = setTimeout(() => {
      if (config.onTimeout) {
        config.onTimeout();
      }
    }, SESSION_CONFIG.SESSION_TIMEOUT);
  }

  /**
   * Get remaining session time in milliseconds
   */
  getRemainingTime(studentId) {
    const loginTime = parseInt(
      localStorage.getItem("loginTimestamp") || Date.now()
    );
    const elapsed = Date.now() - loginTime;
    const remaining = SESSION_CONFIG.SESSION_TIMEOUT - elapsed;
    return Math.max(0, remaining);
  }

  /**
   * Format remaining time as MM:SS
   */
  formatRemainingTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  /**
   * End session
   */
  endSession(studentId) {
    const sessionKey = `session_${studentId}`;
    const config = this.sessionTimers[sessionKey];

    if (config) {
      if (config.warningTimer) clearTimeout(config.warningTimer);
      if (config.logoutTimer) clearTimeout(config.logoutTimer);
      delete this.sessionTimers[sessionKey];
    }

    this.clearSessionData();
  }

  /**
   * Clear all session data
   */
  clearSessionData() {
    localStorage.removeItem("studentToken");
    localStorage.removeItem("studentInfo");
    localStorage.removeItem("loginTimestamp");
    localStorage.removeItem("lastActivityTime");
  }

  /**
   * Add activity listener
   */
  onActivity(callback) {
    this.activityListeners.push(callback);
  }

  /**
   * Notify all activity listeners
   */
  notifyActivityListeners() {
    this.activityListeners.forEach((callback) => callback());
  }

  /**
   * Check if student is authenticated
   */
  isAuthenticated() {
    return !!localStorage.getItem("studentToken");
  }

  /**
   * Get student info
   */
  getStudentInfo() {
    const info = localStorage.getItem("studentInfo");
    try {
      return info ? JSON.parse(info) : null;
    } catch (error) {
      console.error("Error parsing student info:", error);
      return null;
    }
  }

  /**
   * Get session duration
   */
  getSessionDuration() {
    const loginTime = parseInt(
      localStorage.getItem("loginTimestamp") || Date.now()
    );
    const elapsed = Date.now() - loginTime;
    const minutes = Math.floor(elapsed / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    return { minutes, seconds, formatted: `${minutes}m ${seconds}s` };
  }
}

export default new SessionManager();
