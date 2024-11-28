const { Kafka } = require('kafkajs');
const { Client } = require('@elastic/elasticsearch');

// Kafka Configuration
const kafka = new Kafka({
    clientId: 'log-consumer',
    brokers: ['kafka:9092'] // Kafka broker address
});

const topic = 'logs';
const consumer = kafka.consumer({ groupId: 'log-consumer-group' });

// Elasticsearch Configuration
const esClient = new Client({ node: 'http://elasticsearch:9200' });
const indexName = 'logs-index';

async function run() {
    // Connect the consumer
    await consumer.connect();
    console.log('Kafka consumer connected.');

    // Subscribe to the topic
    await consumer.subscribe({ topic, fromBeginning: true });
    console.log(`Subscribed to topic: ${topic}`);

    // Consume messages
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            try {
                const logMessage = message.value.toString();
                console.log(`Received log: ${logMessage}`);

                // Prepare log data for Elasticsearch
                const logData = {
                    message: logMessage,
                    topic,
                    partition,
                    offset: message.offset,
                    timestamp: new Date().toISOString()
                };

                // Index the log into Elasticsearch
                const resp = await esClient.index({
                    index: indexName,
                    document: logData
                });

                console.log('logData: --->', logData);
                console.log('Log indexed in Elasticsearch:', resp);
            } catch (error) {
                console.error('Error processing message:', error);
            }
        }
    });
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
    console.log('Disconnecting Kafka consumer...');
    await consumer.disconnect();
    console.log('Kafka consumer disconnected.');
    process.exit(0);
});

run().catch(console.error);
