# Multi-stage build for production

# Stage 1: Build Backend
FROM node:20-alpine AS backend-builder
WORKDIR /app
COPY server/package*.json ./
RUN npm ci
COPY server .
RUN npm run build

# Stage 2: Build Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY client/package*.json ./
RUN npm ci
COPY client .
RUN npm run build

# Stage 3: Production image
FROM node:20-alpine
WORKDIR /app

# Copy backend build
COPY --from=backend-builder /app/dist ./dist
COPY --from=backend-builder /app/node_modules ./node_modules
COPY server/package*.json ./

# Copy frontend build to public folder
COPY --from=frontend-builder /app/dist ./public

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/api/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start application
CMD ["npm", "start"]
