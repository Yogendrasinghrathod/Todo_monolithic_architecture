# Stage 1: Build the React client
FROM node:20-alpine AS client-builder
WORKDIR /app/client

# Copy client package files
COPY client/package*.json ./
RUN npm install

# Copy client source code
COPY client/ ./

# Build the client
RUN npm run build

# Stage 2: Build the server and combine with client
FROM node:20-alpine AS server-builder
WORKDIR /app/server

# Copy server package files
COPY server/package*.json ./
RUN npm install --production

# Copy server source code
COPY server/ ./

# Stage 3: Final image
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

# Copy server files
COPY --from=server-builder /app/server /app/server

# Copy built client files
COPY --from=client-builder /app/client/dist /app/client/dist

# Set working directory to server
WORKDIR /app/server

# Expose port
EXPOSE 8000

# Start the server
CMD ["node", "app.js"]

