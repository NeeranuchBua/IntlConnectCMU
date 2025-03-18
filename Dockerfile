FROM imbios/bun-node:18-slim

WORKDIR /app

# Copy files and install dependencies
COPY package.json bun.lockb ./
RUN bun install

COPY prisma ./prisma
RUN npx prisma generate

# Expose the development port
EXPOSE 3000