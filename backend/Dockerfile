# Dockerfile

# Use Node.js as the base image
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the app
RUN npm run build

# Expose the port NestJS runs on
EXPOSE 3000

# Run the app
CMD ["npm", "run", "start:prod"]
