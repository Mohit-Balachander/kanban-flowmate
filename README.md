## Kanban FlowMate

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Prometheus](https://img.shields.io/badge/Prometheus-E6522C?style=for-the-badge&logo=prometheus&logoColor=white)
![Grafana](https://img.shields.io/badge/Grafana-F46800?style=for-the-badge&logo=grafana&logoColor=white)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

**Kanban FlowMate** is a full‑stack Kanban board application designed with **observability and DevOps** in mind. It combines a modern React/TypeScript frontend, a Node.js/Express backend, and a Dockerized monitoring stack (Prometheus + Grafana).

---

## Features

- **Modern Kanban UI**: React + Vite, drag‑and‑drop columns and cards.
- **API backend**: Node.js/Express with file‑based persistence (`board-data.json`).
- **Metrics & monitoring**: Prometheus metrics exposed from the backend and Grafana dashboards.
- **Containerized stack**: Multi‑stage Docker build and `docker-compose` for local production‑like runs.
- **CI/CD pipeline**: GitHub Actions workflow for build, test, Docker validation, and image publishing.

---

## Architecture

The system is built from three main services:

- **Frontend** (React / Vite / TypeScript) – compiled into a static bundle served by the backend.
- **Backend** (Node.js / Express) – serves the SPA, exposes the Kanban API and `/metrics`.
- **Monitoring stack** (Prometheus + Grafana) – collects and visualizes application metrics.

Runtime ports when using Docker Compose:

- **App (Node + React build)**: `http://localhost:8081`
- **Prometheus**: `http://localhost:9091`
- **Grafana**: `http://localhost:3001`

The backend listens on port `8080` inside the container; `docker-compose.yml` maps it to `8081` on the host.

---

## Local Development

Install dependencies (frontend + backend):

```bash
npm install
cd server && npm install && cd ..
```

Start the development environment (Vite + Node server + monitoring helpers):

```bash
chmod +x start-dev.sh
./start-dev.sh
```

Useful scripts:

- `npm run dev` – start the Vite dev server.
- `npm run build` – type‑check and build the frontend.
- `npm run lint` – run ESLint on the codebase.
- `npm run preview` – preview the production build locally.

---

## Running with Docker

Build and start the full stack (app + Prometheus + Grafana):

```bash
docker compose up --build
```

Then open:

- **Kanban board**: `http://localhost:8081`
- **Prometheus**: `http://localhost:9091`
- **Grafana**: `http://localhost:3001` (default admin user/password, unless overridden)

The Dockerfile uses a **multi‑stage build** on top of `node:18-alpine`:

- Stage 1: builds the React frontend with Vite into `/app/dist`.
- Stage 2: installs production dependencies for the backend.
- Final stage: serves the built frontend from `/public` and runs `node index.js` on port `8080`.

---

## API & Metrics

Main backend endpoints (served by `server/index.js`):

- `GET /api/board` – fetch the full Kanban board state.
- `POST /api/cards` – create a new card.
- `PUT /api/cards/:id` – update an existing card.
- `DELETE /api/cards/:id` – delete a card.
- `GET /metrics` – Prometheus metrics exported via `express-prom-bundle`.

The backend also serves the built React app for all other routes:

- `GET *` – returns the SPA entry (`public/index.html`).

---

## CI/CD (GitHub Actions)

The repository includes a CI/CD workflow at `.github/workflows/ci-cd.yml` with two jobs:

- **build-and-test**
  - Checks out the code.
  - Sets up Node.js 18 with npm cache.
  - Runs `npm ci` and `npm run build`.
  - Builds the Docker image with `docker/build-push-action`.
  - Starts the stack with `docker compose up -d`.
  - Waits for the app to become healthy by polling `http://localhost:8081/api/board`.
  - Runs health checks:
    - `GET /api/board`
    - `GET /metrics`
  - Shows container status and tears down the stack.

- **push-to-registry**
  - Runs only on `push` to `main` after **build-and-test** succeeds.
  - Logs in to Docker Hub using `DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN` secrets.
  - Builds and pushes the Docker image tagged as:
    - `${DOCKERHUB_USERNAME}/kanban-flowmate:latest`
    - `${DOCKERHUB_USERNAME}/kanban-flowmate:${GITHUB_SHA}`

---

## License

This project is licensed under the **MIT License**. See the [`LICENSE`](LICENSE) file for details.
