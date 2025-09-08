FROM node:20-bookworm-slim AS deps
WORKDIR /app
COPY package.json ./
ENV npm_config_platform=linux
ENV npm_config_arch=arm64
ENV npm_config_libc=glibc
RUN npm i --include=optional
FROM node:20-bookworm-slim AS build
WORKDIR /app
COPY package.json ./
COPY --from=deps /app/node_modules ./node_modules
COPY tsconfig*.json vite.config.* ./
COPY index.html ./
COPY public ./public
COPY src ./src
ARG VITE_API_URL
ARG VITE_CDN_URL
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_CDN_URL=${VITE_CDN_URL}
RUN npm run build