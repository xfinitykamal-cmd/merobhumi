# Admin Dockerfile
FROM node:20-alpine as builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# Setup serve env
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port and run nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]