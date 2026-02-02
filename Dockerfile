FROM oven/bun:1.3.8-alpine

RUN apk add --no-cache nodejs=22.22.0-r0

WORKDIR /app
COPY . .

RUN bun install --frozen-lockfile

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

CMD ["./docker-cmd.sh"]
