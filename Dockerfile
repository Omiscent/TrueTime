# Builds and serves the web version of TrueTime — the same React UI as the
# native Tauri app, minus the native shell. There's no updater, no installer,
# and no system-tray integration here; useAppUpdater() detects it's not
# running inside Tauri and no-ops, so the update banner never appears.
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
