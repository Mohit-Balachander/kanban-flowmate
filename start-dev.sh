#!/bin/bash

# Development startup script for Kanban with monitoring

echo "🚀 Starting Kanban Board with Monitoring (Development Mode)"
echo "============================================================"

# Start the backend server
echo "📡 Starting Node.js backend on port 8080..."
cd server && node index.js &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 2

# Start the React frontend dev server
echo "⚛️  Starting React frontend on port 5173..."
cd .. && npm run dev &
FRONTEND_PID=$!

# Start monitoring stack
echo "📊 Starting monitoring stack..."
docker-compose up prometheus grafana &
DOCKER_PID=$!

echo ""
echo "✅ Development environment started!"
echo "📱 Frontend: http://localhost:5173"
echo "🔧 Backend API: http://localhost:8080/api"
echo "📊 Prometheus: http://localhost:9090"
echo "📈 Grafana: http://localhost:3000 (admin/admin)"
echo ""
echo "Press Ctrl+C to stop all services"

# Function to cleanup on exit
cleanup() {
    echo "🛑 Stopping all services..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    docker-compose down
    echo "✅ All services stopped"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for any process to exit
wait