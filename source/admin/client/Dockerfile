ARG NODE_VERSION=22.19.0-alpine
ARG NGINX_VERSION=alpine3.22

# Stage 1
FROM node:${NODE_VERSION} AS builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN --mount=type=cache,target=/root/.npm npm ci

COPY . .

RUN npm run build

# Stage 2
FROM nginxinc/nginx-unprivileged:${NGINX_VERSION} AS runner

USER nginx
COPY nginx.conf /etc/nginx/nginx.conf
COPY --chown=nginx:nginx  --from=builder /app/dist /usr/share/nginx/html
EXPOSE 5173

ENTRYPOINT ["nginx", "-c", "/etc/nginx/nginx.conf"]
CMD ["-g", "daemon off;"]