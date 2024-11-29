# Distributed Event Logging System

This project provides a distributed event logging setup using the Elastic Stack (Elasticsearch, Logstash, Kibana) and Kafka. It supports secure communication and logging for distributed systems with detailed configurations for Elasticsearch nodes, Logstash pipelines, and Kafka integration.

---

## Project Structure

```plaintext
Distributed-Event-Logging/
├── certs/
│   ├── kibana/
│   │   ├── http.crt
│   │   ├── http.key
│   ├── node1/
│   │   ├── elasticsearch-node1.p12
│   │   ├── elasticsearch.yml
│   ├── node2/
│   │   ├── elasticsearch-node2.p12
│   │   ├── elasticsearch.yml
├── dlq-consumer/
│   ├── Dockerfile
│   ├── package.json
│   ├── processDLQ.js
├── elastic-cert/
│   ├── elasticsearch-node1.p12
│   ├── elasticsearch-node2.p12
│   ├── kibana.p12
│   ├── ca.crt
│   ├── ca.key
├── kafka-to-elastic/
│   ├── Dockerfile
│   ├── kafka-to-elastic.js
│   ├── package.json
├── logs/
│   ├── app.log
├── logstash/pipeline/
│   ├── logstash.conf
├── docker-compose.yml
├── README.md
```

Prerequisites
Docker and Docker Compose: Install Docker and Docker Compose to run the containers.
Node.js: Required for running the Kafka consumer scripts.
Elastic Stack License: Ensure you have a valid license for the Elastic Stack components.
OpenSSL: Required for generating SSL/TLS certificates for secure communication.

Setup Instructions
Step 1: Clone the Repository
```plaintext
git clone <repository-url>
cd Distributed-Event-Logging-Kiran
```

Step 2: Generate Certificates for Secure Communication
Use OpenSSL to generate self-signed certificates:

Navigate to the certs/ directory.

Run the following commands to create a CA certificate:
```plaintext
openssl genrsa -out elastic-stack-ca.key 2048
openssl req -new -x509 -key elastic-stack-ca.key -sha256 -out elastic-stack-ca.crt -days 3650 \
  -subj "/C=US/ST=State/L=City/O=Organization/OU=IT/CN=ElasticStackCA"
```

Generate certificates for Elasticsearch nodes:
```plaintext
openssl genrsa -out elasticsearch-node1.key 2048
openssl req -new -key elasticsearch-node1.key -out elasticsearch-node1.csr \
  -subj "/C=US/ST=State/L=City/O=Organization/OU=IT/CN=node1"
openssl x509 -req -in elasticsearch-node1.csr -CA elastic-stack-ca.crt -CAkey elastic-stack-ca.key \
  -CAcreateserial -out elasticsearch-node
```

