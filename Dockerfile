FROM node:18-alpine

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy only the necessary files for dependency installation
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Now copy the rest of the project (without node_modules, thanks to .dockerignore)
COPY . .

# Build the project
RUN pnpm run build

# Set environment variables
ENV NODE_ENV=production

# Expose the app port
EXPOSE 3000

# Start the app
CMD ["pnpm", "start"]
