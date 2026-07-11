# Frontend Dockerfile - React Production Build
# Stage 1: Build the application
FROM node:16-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies including devDependencies (react-scripts is required for build)
# npm ci installs from package-lock.json with explicit --include=dev flag
# Fallback to npm install if lock file has issues
RUN npm ci --include=dev || npm install

# Copy application files
COPY . .

# Build arguments for environment variables
ARG REACT_APP_BASEURL
ARG REACT_APP_BASEURL1
ARG REACT_APP_NLFS_DIESEL_VENDOR
ARG REACT_APP_NLFS_DIESEL_MATERIAL_CODE

# Set environment variables
ENV REACT_APP_BASEURL=${REACT_APP_BASEURL}
ENV REACT_APP_BASEURL1=${REACT_APP_BASEURL1}
ENV REACT_APP_NLFS_DIESEL_VENDOR=${REACT_APP_NLFS_DIESEL_VENDOR}
ENV REACT_APP_NLFS_DIESEL_MATERIAL_CODE=${REACT_APP_NLFS_DIESEL_MATERIAL_CODE}

# Build the application
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy custom nginx config
COPY docker/nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files from builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
