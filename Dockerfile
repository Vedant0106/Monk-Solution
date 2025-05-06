# syntax=docker/dockerfile:1

# Define the Node version to use
ARG NODE_VERSION=22.15.0

################################################################################
# Base image
FROM node:${NODE_VERSION}-alpine AS base

# Set working directory
WORKDIR /usr/src/app

################################################################################
# Dependency installation stage (production deps)
FROM base AS deps

# Install only production dependencies
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

################################################################################
# Build stage (requires devDependencies)
FROM base AS build

# Install all dependencies (including devDependencies)
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci

# Copy the rest of the app source code
COPY . .

# Build the React application
RUN npm run build

################################################################################
# Final runtime stage
FROM node:${NODE_VERSION}-alpine AS final

# Use production environment
ENV NODE_ENV=production

# Set working directory
WORKDIR /usr/src/app

# Copy only what's needed to run the app
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/build ./build
COPY --from=build /usr/src/app/package.json ./

# Install a simple HTTP server to serve the static files
RUN npm install -g serve

# Expose port React app will run on
EXPOSE 3000

# Command to serve the app
CMD ["serve", "-s", "build", "-l", "3000"]
