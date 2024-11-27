FROM node:18
WORKDIR /app
COPY package.json /app/
RUN npm install
COPY . /app/
CMD ["node", "kafka-to-elastic.js"]
