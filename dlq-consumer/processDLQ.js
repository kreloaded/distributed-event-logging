const { Kafka } = require('kafkajs');
const { Client } = require('@elastic/elasticsearch');

const kafka = new Kafka({
    clientId: 'dlq-consumer',
    brokers: ['kafka:9092']
});

const dlqLogTopic = 'dlq-logs';
const dlqConsumer = kafka.consumer({ groupId: 'dlq-consumer-group' });

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
const dlqIndexName = 'dlq-logs-index';

async function processDLQ() {
    await dlqConsumer.connect();
    console.log('Connected to DLQ consumer.');

    await dlqConsumer.subscribe({ topic: dlqLogTopic, fromBeginning: true });
    console.log(`Subscribed to DLQ topic: ${dlqLogTopic}`);

    await dlqConsumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const logMessage = message.value.toString();

            try {
                const dlqLogData = {
                    message: logMessage,
                    topic,
                    partition,
                    offset: message.offset,
                    timestamp: new Date().toISOString()
                };

                await esClient.index({
                    index: dlqIndexName,
                    document: dlqLogData,
                });
                console.log(`Indexed DLQ log: ${dlqLogData}`);
            } catch (error) {
                console.error('Failed to index DLQ log:', error);
            }
        }
    });
}

processDLQ().catch(console.error);
