FROM node:18

# Install netcat for health checks
RUN apt-get update && apt-get install -y netcat-openbsd && apt-get clean

# Set working directory
WORKDIR /usr/src/app

# Copy dependencies
COPY package*.json ./
RUN npm install

# Copy application code
COPY . .

# Run the DLQ consumer script
CMD ["npm", "start"]
