# NoteFlow DevOps Guide

This repository contains a React frontend, Express backend, and PostgreSQL persistence.

## Local development

### Backend
```bash
cd backend
npm install
npm run dev
```
- Backend runs on `http://localhost:5001` by default.
- Health check: `http://localhost:5001/health`

### Frontend
```bash
cd frontend
npm install
npm start
```
- Frontend runs on `http://localhost:3000`
- Frontend proxy forwards API requests to the backend.

## Docker development

### Bring up the full stack
```bash
docker compose up --build
```
- `postgres` on `5432`
- `backend` on `5000`
- `frontend` on `3000`

### Tear down
```bash
docker compose down
```

## Jenkins / CI notes

The included `jenkinsfile` performs:
- Git checkout
- `npm install` for backend and frontend
- Frontend build (`npm run build`)
- SonarQube scan
- Docker image build for backend and frontend
- Docker push to Docker Hub
- Deploy via `docker-compose` update

This repo is also integrated with GitHub via webhook, so pushes to the `main` branch trigger the pipeline automatically.

## Useful commands

```bash
# Run backend locally
cd backend && npm run dev

# Run frontend locally
cd frontend && npm start

# Run entire stack with Docker Compose
docker compose up --build

# Stop and remove containers
docker compose down
```
