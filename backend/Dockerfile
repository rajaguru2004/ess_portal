# Base image
FROM node:18-alpine AS base
WORKDIR /app
# Install libc6-compat for Prisma on Alpine
RUN apk add --no-cache libc6-compat openssl

# Dependencies stage - Install ALL dependencies (for building/generating)
FROM base AS deps
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci

# Builder stage - Generate Prisma client
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY prisma ./prisma/
RUN npx prisma generate

# Development stage
FROM base AS development
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install
COPY . .
RUN npx prisma generate
EXPOSE 3000
CMD ["npm", "run", "dev"]

# Production stage
FROM base AS production
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
  adduser -S nodejs -u 1001

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy generated Prisma Client from builder stage
# This avoids needing the 'prisma' CLI (devDependency) in the production image
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client

# Copy application code
COPY . .

# Change ownership
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start production server
CMD ["npm", "start"]
