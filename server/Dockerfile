FROM node:25-alpine
WORKDIR /app

# Install pnpm via npm
RUN npm install -g pnpm@10.28.2

# Copy dependency files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Set default environment to production (can be overridden)
ENV NODE_ENV=production

EXPOSE 3000
CMD ["pnpm", "start"]