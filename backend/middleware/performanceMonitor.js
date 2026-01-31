const performanceMonitor = (req, res, next) => {
  const start = process.hrtime();
  
  // Add performance headers
  res.on('finish', () => {
    const [seconds, nanoseconds] = process.hrtime(start);
    const duration = seconds * 1000 + nanoseconds / 1000000; // Convert to milliseconds
    
    // Log slow requests (> 1000ms)
    if (duration > 1000) {
      console.warn(`SLOW REQUEST: ${req.method} ${req.path} took ${duration.toFixed(2)}ms`);
    }
    
    // Only set header if response hasn't been sent yet
    if (!res.headersSent) {
      res.setHeader('X-Response-Time', `${duration.toFixed(2)}ms`);
    }
    
    // Log performance metrics
    console.log(`PERF: ${req.method} ${req.path} - ${res.statusCode} - ${duration.toFixed(2)}ms`);
  });
  
  next();
};

module.exports = performanceMonitor; 