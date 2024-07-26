# Build the Angular App
# This compiles the Angular project to static HTML and JS files.
FROM node:22-alpine as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json ./
COPY package-lock.json ./
RUN npm ci --silent
COPY . ./
RUN npm run build

# Serve these static files with NGINX
FROM nginx:1.21.6-alpine
COPY --from=build /app/dist/planpal /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
