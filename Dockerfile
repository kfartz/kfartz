FROM oven/bun:1.3.8-alpine

LABEL org.opencontainers.image.url=https://github.com/kfartz/kfartz
LABEL org.opencontainers.image.source=https://github.com/kfartz/kfartz
LABEL org.opencontainers.image.title=Kfartz
LABEL org.opencontainers.image.revision=
LABEL org.opencontainers.image.created=
LABEL org.opencontainers.image.version=
LABEL org.opencontainers.image.description="A crystallography measurement metadata database for managing crystal structure analysis data."
LABEL org.opencontainers.image.licenses=

RUN apk add --no-cache nodejs

WORKDIR /app
COPY . .

RUN bun install --frozen-lockfile

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

ENTRYPOINT ["/bin/sh", "-c"]
CMD ["bun run payload migrate && bun run build && bun run start"]
