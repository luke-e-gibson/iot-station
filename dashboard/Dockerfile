# Use Node.js 20 Alpine as base image
FROM node:20-alpine AS base

# Install pnpm via npm
RUN npm install -g pnpm@10.28.2

# Set working directory
WORKDIR /app

# Copy pnpm workspace files
COPY pnpm-lock.yaml ./
COPY package.json ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build stage
FROM base AS build

# Build the application
RUN pnpm run build

# Production stage
FROM nginx:alpine AS production

# Copy built assets to nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration if needed
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]