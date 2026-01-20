# Multi-stage build for smaller image size
FROM node:20-alpine AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.18.2 --activate

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN pnpm run build

# Production stage
FROM node:20-alpine AS production

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.18.2 --activate

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install production dependencies only
RUN pnpm install --prod --frozen-lockfile

# Copy built files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/index.ts ./src/index.ts
COPY --from=builder /app/src/context.ts ./src/context.ts
COPY --from=builder /app/src/db ./src/db
COPY --from=builder /app/src/services ./src/services
COPY --from=builder /app/src/api ./src/api
COPY --from=builder /app/src/client/index.ts ./src/client/index.ts
COPY --from=builder /app/vite.config.ts ./vite.config.ts

# Set production environment
ENV NODE_ENV=production

# Expose port
EXPOSE 3000

# Start the application
CMD ["pnpm", "run", "preview"]
