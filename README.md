# Event-Driven User Activity Service

An event-driven microservice system that ingests user activities via a REST API, publishes them to RabbitMQ, and asynchronously processes and persists them to MongoDB using a background consumer worker.

## Architecture

- **API Service (Gateway)**: Express.js REST API that handles immediate rate limiting (50 req/min per IP), validates incoming activity data, and forwards valid payloads to RabbitMQ.
- **Message Broker**: RabbitMQ manages the durable `user_activities` queue to decouple the gateway from the processing logic.
- **Consumer Service**: A Node.js background worker that consumes events from RabbitMQ and saves them to MongoDB.
- **Database**: MongoDB handles persistence for all events.

## Prerequisites
- Docker
- Docker Compose

## Quick Start
1. Clone the repository
2. Rename `.env.example` to `.env` if you want to customize configs.
3. Start the entire system with Docker Compose:
    ```bash
    docker-compose up --build -d
    ```
4. Access the API at `http://localhost:3000/api/v1/activities`.
5. Access the RabbitMQ Management UI at `http://localhost:15672` (default credentials: `guest` / `guest`).


## Running Tests Locally
To run the automated test suite locally:

```bash
# Inside docker
docker-compose exec api npm test
docker-compose exec consumer npm test
```

## API Documentation
Please see [API_DOCS.md](./API_DOCS.md) for full descriptions of exposed endpoints.