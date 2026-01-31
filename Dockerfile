# Multi-stage build for production
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY client/package*.json ./client/
COPY backend/package*.json ./backend/

# Install dependencies
RUN npm ci --prefix ./client
RUN npm ci --prefix ./backend --production

# Copy source code
COPY client/ ./client/
COPY backend/ ./backend/

# Build frontend
RUN npm run build --prefix ./client

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Copy built application
COPY --from=builder /app/backend ./backend
COPY --from=builder /app/client/build ./backend/public

# Set environment
ENV NODE_ENV=production
ENV PORT=5000

# Expose port
EXPOSE 5000

# Start application
CMD ["node", "backend/server.js"] 