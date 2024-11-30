FROM node:18-alpine

# Install netcat for health checks using apk
RUN apk add --no-cache curl netcat-openbsd

# Set working directory
WORKDIR /app

# Copy project files
COPY package.json /app/
RUN npm install

# Copy the remaining project files
COPY . /app/

# Command to start the app
CMD ["npm", "start"]
