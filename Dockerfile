###################
# BUILD STAGE
###################
FROM node:18 AS builder
WORKDIR /app

# Dependencies
COPY package*.json ./
RUN npm install

# Source files and build
COPY . .
RUN npx gulp build

###################
# DEPLOY STAGE
###################
FROM nginx:alpine

# Static files
COPY --from=builder /app/dist /usr/share/nginx/html

# Server config
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
