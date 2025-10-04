#!/bin/bash

# Start Playwright MCP Server for MealPrep Project
# This script starts the MCP server with optimized settings for development
# Runs in headed mode for visual testing and supports web + mobile viewports

echo "🚀 Starting Playwright MCP Server for MealPrep..."
echo "🖥️  Running in HEADED mode for visual testing"
echo "📱 Supports both web and mobile viewport testing"

# Create output directory if it doesn't exist
mkdir -p ./playwright-output

# Start the MCP server with development-friendly settings
# Note: Removed --headless flag to run in headed mode
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
  --browser chrome

echo "✅ Playwright MCP Server started on http://localhost:3001"
echo "📁 Output directory: ./playwright-output"
echo "🖥️  Browser will open in headed mode for visual testing"
echo "📱 Use browser_resize tool to test mobile viewports (375x667, 768x1024)"
echo "🛑 Press Ctrl+C to stop the server"
