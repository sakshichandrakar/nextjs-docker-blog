# Stage 1: Install dependencies and build app
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and lock file
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy entire project
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build Next.js app
RUN npm run build

# Stage 2: Production image
FROM node:20-alpine

WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy built app and Prisma client
COPY --from=builder /app/.next .next
COPY --from=builder /app/public public
COPY --from=builder /app/node_modules node_modules
COPY --from=builder /app/prisma prisma
COPY --from=builder /app/next.config.js .
COPY --from=builder /app/package.json .
COPY --from=builder /app/.env .

# Expose Next.js port
EXPOSE 3000

# Start Next.js app
CMD ["npm", "start"]
