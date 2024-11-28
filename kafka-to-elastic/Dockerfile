FROM node:18

# Install netcat for health checks
RUN apt-get update && apt-get install -y netcat-openbsd && apt-get clean

# Set working directory
WORKDIR /app

# Copy project files
COPY package.json /app/
RUN npm install
COPY . /app/

# Command to start the app
CMD ["npm", "start"]
