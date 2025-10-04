#!/bin/bash

# Unified Testing Environment for MealPrep
# Starts both dev server and MCP server for comprehensive testing

echo "🚀 Starting Complete Testing Environment for MealPrep..."
echo "🖥️  This will start both dev server and MCP server"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down testing environment..."
    if [ ! -z "$DEV_PID" ]; then
        kill $DEV_PID 2>/dev/null
        echo "✅ Development server stopped"
    fi
    if [ ! -z "$MCP_PID" ]; then
        kill $MCP_PID 2>/dev/null
        echo "✅ MCP server stopped"
    fi
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Create output directory
mkdir -p ./playwright-output

# Start development server
echo "📱 Starting development server..."
pnpm dev &
DEV_PID=$!
echo "✅ Development server started (PID: $DEV_PID)"

# Wait for dev server to be ready
echo "⏳ Waiting for development server to be ready..."
until curl -s http://localhost:5173 > /dev/null; do
    sleep 2
done
echo "✅ Development server ready at http://localhost:5173"

# Start MCP server
echo "🎭 Starting MCP server..."
npx @playwright/mcp \
  --port 3001 \
  --host localhost \
  --viewport-size 1440x900 \
  --output-dir ./playwright-output \
  --save-session \
  --save-trace \
  --timeout-action 10000 \
  --timeout-navigation 30000 \
  --allowed-hosts "localhost,127.0.0.1" \
  --grant-permissions "clipboard-read,clipboard-write,geolocation" \
  --browser chrome &
MCP_PID=$!

# Wait a moment for MCP server to start
sleep 3
echo "✅ MCP server started on http://localhost:3001"

echo ""
echo "🎯 Testing Environment Ready!"
echo "📱 Dev Server: http://localhost:5173"
echo "🎭 MCP Server: http://localhost:3001"
echo "📁 Output: ./playwright-output"
echo ""
echo "📱 Supported Viewports:"
echo "   - Desktop: 1440x900"
echo "   - Tablet: 768x1024"
echo "   - Mobile: 375x667"
echo "   - Mobile Plus: 414x896"
echo ""
echo "🛑 Press Ctrl+C to stop both servers"

# Keep script running and wait for both processes
wait $DEV_PID $MCP_PID
