FROM node:lts-slim

# Install openssl (required for Prisma)
RUN apt-get update -y && apt-get install -y openssl

WORKDIR /usr/src/app

# Copy ONLY package files first (for better layer caching)
COPY package.json package-lock.json ./
RUN npm ci

# Copy Prisma schema and generate client
COPY prisma ./prisma
RUN npx prisma generate

# Copy the rest of the app
COPY . .

# Build Next.js (if needed for production)
# RUN npm run build

CMD ["sh", "-c", "npm run db:deploy && npm run dev"]