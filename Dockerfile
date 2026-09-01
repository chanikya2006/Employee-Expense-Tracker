# Step 1: Build Angular app
FROM node:latest AS build

# Set working directory inside container
WORKDIR /user/anirudh

# Copy dependencies and install
COPY package.json package-lock.json ./
RUN npm install

# Copy all files and build
COPY . .
RUN npm run build --prod

# Step 2: Serve app using Nginx
FROM nginx:alpine

# Copy built app to Nginx public folder
COPY --from=build /user/anirudh/dist/* /usr/share/nginx/html

# Expose port
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]

#docker build -t my-angular-app .
#docker run -d -p 8080:80 my-angular-app
