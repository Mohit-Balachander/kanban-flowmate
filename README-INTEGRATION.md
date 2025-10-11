# Kanban Board with Docker + Grafana Integration

This project combines a modern React-based Kanban board with Docker containerization and Grafana monitoring.

## 🏗️ Architecture

```
Frontend (React/Vite) → Backend (Node.js/Express) → Monitoring (Prometheus + Grafana)
        Port 5173              Port 8080              Ports 9090 + 3000
```

## 🚀 Quick Start

### Development Mode
```bash
# Install dependencies
npm install
cd server && npm install && cd ..

# Start development environment
chmod +x start-dev.sh
./start-dev.sh
```

### Production Mode (Docker)
```bash
# Build and start all services
docker-compose up --build

# Access the application
# - Kanban Board: http://localhost:8080
# - Prometheus: http://localhost:9090  
# - Grafana: http://localhost:3000 (admin/admin)
```

## 📁 Project Structure

```
kanban-flowmate-42/
├── src/                    # React frontend source
│   ├── components/         # UI components
│   ├── hooks/             # Custom React hooks
│   ├── pages/             # Page components
│   └── types/             # TypeScript definitions
├── server/                # Node.js backend
│   ├── index.js           # Express server with API endpoints
│   └── package.json       # Backend dependencies
├── grafana/               # Grafana configuration
│   └── provisioning/      # Auto-configured dashboards & datasources
├── public/                # Static assets
├── docker-compose.yml     # Multi-service Docker setup
├── Dockerfile             # Multi-stage build
├── prometheus.yml         # Monitoring configuration
└── board-data.json        # Persistent task data
```

## 🔧 Features

### Frontend (React)
- ✅ Modern Kanban board with drag & drop
- ✅ Multiple views (Board, Calendar, List)
- ✅ Advanced card features (subtasks, time tracking, tags)
- ✅ Real-time updates
- ✅ Responsive design with dark/light themes

### Backend (Node.js)
- ✅ RESTful API for CRUD operations
- ✅ File-based data persistence
- ✅ Prometheus metrics integration
- ✅ CORS support for development

### Monitoring (Prometheus + Grafana)
- ✅ Application performance metrics
- ✅ HTTP request monitoring
- ✅ Custom dashboards
- ✅ Automated provisioning

## 🛠️ Development

### Frontend Development
```bash
npm run dev  # Start React dev server (port 5173)
```

### Backend Development
```bash
cd server
node index.js  # Start Node.js server (port 8080)
```

### Building for Production
```bash
npm run build  # Build React app to dist/
```

## 📊 Monitoring

- **Prometheus**: Scrapes metrics from the Node.js app every 15 seconds
- **Grafana**: Visualizes metrics with pre-configured dashboards
- **Custom Metrics**: Track API usage, response times, and application health

## 🔧 API Endpoints

- `GET /api/board` - Fetch entire board state
- `POST /api/cards` - Create new card
- `PUT /api/cards/:id` - Update existing card
- `DELETE /api/cards/:id` - Delete card
- `GET /metrics` - Prometheus metrics

## 🚢 Deployment

The application is containerized and ready for production deployment:

1. **Local Docker**: `docker-compose up --build`
2. **Cloud Deployment**: Push to any Docker-compatible platform
3. **Kubernetes**: Use the Docker images as base for K8s deployments

## 🎯 What's Integrated

✅ **Original Features**: All Docker + Grafana monitoring capabilities preserved  
✅ **New Features**: Modern React UI with advanced Kanban functionality  
✅ **Seamless Integration**: Frontend communicates with existing backend API  
✅ **Production Ready**: Multi-stage Docker build optimized for deployment  
✅ **Development Friendly**: Hot reload for frontend, nodemon for backend