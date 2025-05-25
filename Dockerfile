FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY . .

FROM node:20-alpine AS runner
WORKDIR /app

COPY --from=builder /app/.next/standalone ./.next/standalone
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
CMD ["node", ".next/standalone/server.js"]