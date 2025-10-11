# --- Stage 1: Build the React Frontend ---
# This stage's only job is to compile your professional React code.
FROM node:18-alpine AS frontend-builder
WORKDIR /app

# Copy the dependency manifests first to leverage Docker caching
COPY package.json package-lock.json ./

# Use 'npm ci' for a clean, reliable install based on the lockfile
RUN npm ci

# Copy the rest of the frontend source code and config files
COPY . .

# Run the build script to create the final website
RUN npm run build
# The result is a finished website in the /app/dist folder.


# --- Stage 2: Prepare the Node.js Backend ---
FROM node:18-alpine AS backend-builder
WORKDIR /app
COPY server/package.json server/package-lock.json ./
RUN npm ci --only=production


# --- Stage 3: The Final, Production Image ---
# This is the small, final image that will be run.
FROM node:18-alpine
WORKDIR /app

# Copy the server's dependencies and source code.
COPY --from=backend-builder /app/node_modules ./node_modules
COPY server/index.js .
COPY board-data.json .

# Copy the finished website from the frontend stage into a 'public' folder.
COPY --from=frontend-builder /app/dist ./public

EXPOSE 8080
CMD ["node", "index.js"]