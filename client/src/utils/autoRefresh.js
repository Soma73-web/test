// Auto-refresh utility for components
class AutoRefreshManager {
  constructor() {
    this.intervals = new Map();
    this.callbacks = new Map();
  }

  // Start auto-refresh for a component
  startAutoRefresh(componentId, callback, intervalMs = 180000) { // 3 minutes default
    // Clear existing interval if any
    this.stopAutoRefresh(componentId);
    
    // Store callback
    this.callbacks.set(componentId, callback);
    
    // Start new interval
    const intervalId = setInterval(() => {
      console.log(`Auto-refreshing ${componentId}`);
      callback();
    }, intervalMs);
    
    this.intervals.set(componentId, intervalId);
    
    // Return cleanup function
    return () => this.stopAutoRefresh(componentId);
  }

  // Stop auto-refresh for a component
  stopAutoRefresh(componentId) {
    const intervalId = this.intervals.get(componentId);
    if (intervalId) {
      clearInterval(intervalId);
      this.intervals.delete(componentId);
      this.callbacks.delete(componentId);
    }
  }

  // Stop all auto-refresh
  stopAll() {
    this.intervals.forEach((intervalId) => clearInterval(intervalId));
    this.intervals.clear();
    this.callbacks.clear();
  }

  // Get active intervals count
  getActiveCount() {
    return this.intervals.size;
  }
}

// Global instance
const autoRefreshManager = new AutoRefreshManager();

export default autoRefreshManager; 