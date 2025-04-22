FROM node:18-alpine
WORKDIR /app

# Install dependencies (Prisma included)
COPY package.json package-lock.json ./
RUN npm ci

# Copy app files (including Prisma schema)
COPY . .


# Build Next.js (no DB needed here)
RUN npm run build

# Run migrations + start app
CMD ["sh", "-c", "npm run db:deploy && npm run start"]