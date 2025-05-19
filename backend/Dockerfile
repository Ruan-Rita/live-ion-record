# Base image
FROM node:18

ENV NODE_VERSION 23.6.0

# Set environment variables
ENV NODE_ENV=production

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm ci --include=dev --legacy-peer-deps

# Copy source code
COPY . .

# RUN npm install -g @nestjs/cli
    
# Creates a "dist" folder with the production build
RUN npm run build 

# Expose the desired port (e.g., 3001)
EXPOSE 3001

# # Command to run migrations pendings
CMD ["npm", "run", "migration"]

# Command to run the application
CMD ["node", "dist/src/main"]
