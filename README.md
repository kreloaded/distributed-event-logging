# Distributed Event Logging System

This project provides a distributed event logging setup using the Elastic Stack (Elasticsearch, Logstash, Kibana) and Kafka. It supports secure communication and logging for distributed systems with detailed configurations for Elasticsearch nodes, Logstash pipelines, and Kafka integration.

---

## Project Structure

Distributed-Event-Logging-Kiran/ ├── certs/ │ ├── kibana/ │ │ ├── http.crt │ │ ├── http.key │ ├── node1/ │ │ ├── elasticsearch-node1.p12 │ │ ├── elasticsearch.yml │ ├── node2/ │ │ ├── elasticsearch-node2.p12 │ │ ├── elasticsearch.yml ├── dlq-consumer/ │ ├── Dockerfile │ ├── package.json │ ├── processDLQ.js ├── elastic-cert/ │ ├── elasticsearch-node1.p12 │ ├── elasticsearch-node2.p12 │ ├── kibana.p12 │ ├── ca.crt │ ├── ca.key ├── kafka-to-elastic/ │ ├── Dockerfile │ ├── kafka-to-elastic.js │ ├── package.json ├── logs/ │ ├── app.log ├── logstash/pipeline/ │ ├── logstash.conf ├── docker-compose.yml ├── README.md

yaml
Copy code

---

## Prerequisites

1. **Docker and Docker Compose**: Install Docker Engine and Docker Compose to run the containers.
2. **Node.js**: Required for running the custom Kafka consumer.
3. **Elastic Stack License**: Ensure you have an appropriate license for using Elasticsearch, Logstash, and Kibana securely.
4. **Certificates**: Use the provided certificates for secure communication between Elastic Stack components.

---

## Setup Instructions

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd Distributed-Event-Logging-Kiran
Step 2: Set Up Certificates
Ensure the certs directory contains the required certificates for:

Elasticsearch nodes (node1 and node2).
Kibana.
Logstash.
Step 3: Configure Environment Variables
Set up the following environment variables:

Elasticsearch username and password (e.g., elastic user).
Kafka connection details (e.g., KAFKA_BROKER, TOPIC_NAME).
Step 4: Modify Configurations
Update elasticsearch.yml files for node1 and node2 in the certs directory to reflect your cluster's configuration.
Update logstash.conf to configure pipelines as per your needs.
Step 5: Build and Run Docker Containers
Use the provided docker-compose.yml to spin up all required services:

bash
Copy code
docker-compose up --build
Component Details
Elasticsearch
Two nodes configured for secure communication using .p12 certificates.
YAML files in certs/node1/ and certs/node2/ contain Elasticsearch configurations.
Kibana
Configured to connect securely to the Elasticsearch cluster using the provided kibana.p12 certificate.
Logstash
Processes and forwards logs from Kafka to Elasticsearch.
Configured using the pipeline file logstash/pipeline/logstash.conf.
Kafka
Integration with Elasticsearch for streaming data ingestion.
Custom Dead Letter Queue consumer script (processDLQ.js) to handle message failures.
Usage
Start the Stack
Spin up the stack using Docker Compose:

bash
Copy code
docker-compose up
Access the Services
Kibana UI: http://localhost:5601
Elasticsearch API: http://localhost:9200
Kafka Dead Letter Queue (DLQ) Consumer
Navigate to the dlq-consumer/ directory and install dependencies:

bash
Copy code
cd dlq-consumer
npm install
node processDLQ.js
Troubleshooting
Certificate Issues: Ensure that the .p12 and .crt files are correctly placed in the certs directory.
Container Failures: Check container logs using:
bash
Copy code
docker-compose logs <container-name>
Connectivity Issues: Verify that all components use the correct hostnames and ports.
Contributing
Feel free to raise issues or submit pull requests to improve the project.
