const { Kafka } = require('kafkajs');
const { Client } = require('@elastic/elasticsearch');

const kafka = new Kafka({
    clientId: 'log-consumer',
    brokers: ['kafka:9092']
});

const logTopic = 'logs';
const dlqLogTopic = 'dlq-logs'
const consumer = kafka.consumer({ groupId: 'log-consumer-group' });

// Elasticsearch Configuration
const esClient = new Client({
    node: 'https://elasticsearch:9200',
    auth: {
        username: 'elastic',
        password: '7*HG5aY5b0uLXJO=AIT8'
    },
    tls: {
        rejectUnauthorized: false // Disable certificate validation for self-signed certs
    }
});
const indexName = 'logs-index';

async function run() {
    // Connect the consumer
    await consumer.connect();
    console.log('Kafka consumer connected.');

    // Subscribe to the topic
    await consumer.subscribe({ topic: logTopic, fromBeginning: true });
    console.log(`Subscribed to topic: ${logTopic}`);

    // Consume messages
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const logMessage = message.value.toString();
            const maxRetries = 3;
            let attempts = 0;

            while (attempts < maxRetries) {
                try {
                    const logData = {
                        message: logMessage,
                        topic,
                        partition,
                        offset: message.offset,
                        timestamp: new Date().toISOString()
                    };

                    await esClient.index({
                        index: indexName,
                        document: logData,
                    });
                    console.log(`Successfully indexed log: ${logData}`);

                    const randomDelay = Math.random() * 1000;
                    await new Promise((resolve) => setTimeout(resolve, randomDelay));

                    return;
                } catch (error) {
                    attempts++;
                    console.error(`Attempt ${attempts} failed:`, error);
                    if (attempts >= maxRetries) {
                        // Send to Dead Letter Queue
                        const producer = kafka.producer();
                        await producer.connect();
                        await producer.send({
                            topic: dlqLogTopic,
                            messages: [{ value: logMessage }],
                        });
                        await producer.disconnect();
                        console.error(`Moved to Dead Letter Queue: ${logMessage}`);
                    }
                }
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
