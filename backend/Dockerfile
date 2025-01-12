FROM alpine:3.21

ENV NODE_VERSION 23.6.0

# Set environment variables
ENV NODE_ENV=production

# Install necessary tools and clean up
RUN apk add --no-cache curl
RUN apk add --no-cache nodejs npm

# Set working directory
# WORKDIR /usr/temp
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./

RUN npm install --production

# Copy source code
COPY . .

# Expose the desired port (e.g., 3001)
EXPOSE 3001

# Command to run the application
CMD ["npm", "run", "start:nodemon"]