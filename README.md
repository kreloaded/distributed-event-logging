# Distributed Event Logging Setup Guide

Welcome to the Distributed Event Logging project! This guide will walk you through setting up the entire environment from scratch. It covers all necessary configurations, installations, and troubleshooting steps to ensure a smooth setup experience, even if you're doing it for the first time.

---

## Table of Contents

1. Prerequisites
2. Project Overview
3. Directory Structure
4. Setup Instructions
   - Clone the Repository
   - Install Docker and Docker Compose
   - Generate SSL Certificates
   - Configure Elasticsearch Keystore
   - Update Configuration Files
   - Start the Docker Compose Stack
   - Verify the Setup
5. Detailed Configuration
   - Docker Compose File
   - Elasticsearch Configuration
   - Kibana Configuration
   - Logstash Configuration
6. Troubleshooting

---

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Docker** (version 20.10 or higher)
- **Docker Compose** (version 1.29 or higher)
- **Git**

> **Note**: This setup is designed for macOS and Linux environments.

---

## Project Overview

This project sets up a distributed event logging system using the following components:

- **Elasticsearch**: Distributed search and analytics engine.
- **Kibana**: Visualization tool for Elasticsearch data.
- **Logstash**: Data processing pipeline for ingesting data into Elasticsearch.
- **Kafka**: Distributed event streaming platform.
- **Zookeeper**: Centralized service for maintaining configuration information.

**Custom Services**:
- `kafka-to-elastic`: Service to transfer data from Kafka to Elasticsearch.
- `dlq-consumer`: Dead Letter Queue consumer service.

---

## Directory Structure

```plaintext
distributed-event-logging/
├── certs/
│   ├── node1/
│   │   ├── elasticsearch-node1.p12
│   │   └── elasticsearch.yml
│   ├── node2/
│   │   ├── elasticsearch-node2.p12
│   │   └── elasticsearch.yml
│   └── kibana/
│       ├── http.crt
│       ├── http.key
├── kafka-to-elastic/
│   └── [Your kafka-to-elastic service code]
├── dlq-consumer/
│   └── [Your dlq-consumer service code]
├── logstash/
│   └── pipeline/
│       └── logstash.conf
├── logs/
├── docker-compose.yml
└── README.md
```

Setup Instructions
Clone the Repository
Clone the project repository to your local machine
```plaintext
git clone https://github.com/kreloaded/distributed-event-logging/distributed-event-logging.git
cd distributed-event-logging
```

Install Docker and Docker Compose
If you haven't installed Docker and Docker Compose, follow these instructions:

Docker Installation:

macOS: Install Docker Desktop from Docker for Mac.
Linux: Follow the official Docker Engine installation guide.
Docker Compose Installation:

macOS: Docker Desktop includes Docker Compose.
Linux:

```plaintext
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

Generate SSL Certificates
We need SSL certificates for secure communication between Elasticsearch nodes.

Generate Certificates for Elasticsearch Nodes
Use Elasticsearch's certutil tool to generate certificates:
```plaintext
# Navigate to the Elasticsearch directory
cd /usr/share/elasticsearch

# Generate certificates for node1
bin/elasticsearch-certutil cert --silent --pem --in ~/distributed-event-logging/certs/node1/elasticsearch.yml --out ~/distributed-event-logging/certs/node1/elasticsearch-node1.zip

# Unzip the certificates
unzip ~/distributed-event-logging/certs/node1/elasticsearch-node1.zip -d ~/distributed-event-logging/certs/node1

# Repeat for node2
bin/elasticsearch-certutil cert --silent --pem --in ~/distributed-event-logging/certs/node2/elasticsearch.yml --out ~/distributed-event-logging/certs/node2/elasticsearch-node2.zip
unzip ~/distributed-event-logging/certs/node2/elasticsearch-node2.zip -d ~/distributed-event-logging/certs/node2
```

Note: Adjust paths according to your environment.

Generate Certificates for Kibana
Generate SSL certificates for Kibana:
```plaintext
openssl req -newkey rsa:2048 -nodes -keyout certs/kibana/http.key -x509 -days 365 -out certs/kibana/http.crt -subj "/CN=localhost"
```

Configure Elasticsearch Keystore
For storing sensitive settings like keystore passwords, we'll use the Elasticsearch keystore.

Create Elasticsearch Keystore
```plaintext
# For node1
docker run --rm -it -v $(pwd)/certs/node1:/usr/share/elasticsearch/config elasticsearch:7.17.12 elasticsearch-keystore create

# For node2
docker run --rm -it -v $(pwd)/certs/node2:/usr/share/elasticsearch/config elasticsearch:7.17.12 elasticsearch-keystore create
```

Add Passwords to Keystore
Add keystore and truststore passwords:

```plaintext
# For node1
docker run --rm -it -v $(pwd)/certs/node1:/usr/share/elasticsearch/config elasticsearch:7.17.12 elasticsearch-keystore add xpack.security.transport.ssl.keystore.password
docker run --rm -it -v $(pwd)/certs/node1:/usr/share/elasticsearch/config elasticsearch:7.17.12 elasticsearch-keystore add xpack.security.transport.ssl.truststore.password

# For node2
docker run --rm -it -v $(pwd)/certs/node2:/usr/share/elasticsearch/config elasticsearch:7.17.12 elasticsearch-keystore add xpack.security.transport.ssl.keystore.password
docker run --rm -it -v $(pwd)/certs/node2:/usr/share/elasticsearch/config elasticsearch:7.17.12 elasticsearch-keystore add xpack.security.transport.ssl.truststore.password
```

Update Configuration Files
Ensure all configuration files are correctly set up.

Update docker-compose.yml
Verify the docker-compose.yml file in your project directory matches the required configuration.

Update Elasticsearch Configuration
Node 1: ./certs/node1/elasticsearch.yml
Node 2: ./certs/node2/elasticsearch.yml

Start the Docker Compose Stack
Before starting, ensure all previous Docker containers and volumes are removed to prevent conflicts:
```plaintext
docker-compose down --volumes --remove-orphans
docker volume prune -f
```

Now, start the Docker Compose stack:
```plaintext
docker-compose up -d
```

Verify the Setup
Check Elasticsearch Nodes
Verify that both Elasticsearch nodes are running: 
```plaintext
docker ps
```

You should see elasticsearch-node1 and elasticsearch-node2 in the list.

Access Elasticsearch
Access Elasticsearch in your browser or via curl:

Node 1: http://localhost:9200
Node 2: http://localhost:9201

Access Kibana
Access Kibana at http://localhost:5601.

Login credentials:

Username: elastic
Password: ""

Troubleshooting
If you encounter issues during setup, consider the following:

Check Container Logs:
```plaintext
docker logs -f elasticsearch-node1
docker logs -f elasticsearch-node2
docker logs -f kibana
```

