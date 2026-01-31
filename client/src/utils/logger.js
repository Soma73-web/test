// Production-safe logging utility
const isDevelopment = process.env.NODE_ENV === 'development';

export const logger = {
  log: (...args) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },
  
  error: (...args) => {
    if (isDevelopment) {
      console.error(...args);
    }
    // In production, you could send errors to a logging service
    // like Sentry, LogRocket, or your own error tracking system
  },
  
  warn: (...args) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },
  
  info: (...args) => {
    if (isDevelopment) {
      console.info(...args);
    }
  }
};

export default logger; 