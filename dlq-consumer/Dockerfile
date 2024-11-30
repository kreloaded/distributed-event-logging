FROM node:18-alpine

# Install netcat for health checks using apk
RUN apk add --no-cache curl netcat-openbsd

# Set working directory
WORKDIR /usr/src/app

# Copy dependencies
COPY package*.json ./
RUN npm install

# Copy application code
COPY . .

# Run the DLQ consumer script
CMD ["npm", "start"]
