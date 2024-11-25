const fs = require('fs');
const { KafkaClient, Producer } = require('kafka-node');

// Kafka Configuration
const client = new KafkaClient({ kafkaHost: 'kafka:9092' });
const producer = new Producer(client);

const LOG_FILE = './logs/app.log';
const TOPIC = 'logs';

// Watch the log file for changes
fs.watchFile(LOG_FILE, { interval: 1000 }, (curr, prev) => {
    console.log('Log file updated...');
    const logs = fs.readFileSync(LOG_FILE, 'utf8');
    const newLogs = logs.split('\n').slice(prev.size).join('\n');

    if (newLogs.trim()) {
        producer.send([{ topic: TOPIC, messages: newLogs }], (err, data) => {
            if (err) console.error('Error sending logs:', err);
            else console.log('Logs sent to Kafka:', data);
        });
    }
});

// Kafka Connection
producer.on('ready', () => console.log('Kafka Producer is connected.'));
producer.on('error', (err) => console.error('Kafka Error:', err));
