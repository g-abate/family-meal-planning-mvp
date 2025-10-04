#!/bin/bash

# Mobile Responsive Testing Script for MealPrep
# This script tests the application across different viewport sizes

echo "📱 Starting Mobile Responsive Testing for MealPrep..."

# Start the dev server in background if not already running
if ! curl -s http://localhost:5173 > /dev/null; then
    echo "🚀 Starting development server..."
    pnpm dev &
    DEV_PID=$!
    sleep 5
    echo "✅ Development server started (PID: $DEV_PID)"
fi

# Wait for dev server to be ready
echo "⏳ Waiting for development server to be ready..."
until curl -s http://localhost:5173 > /dev/null; do
    sleep 2
done

echo "✅ Development server is ready at http://localhost:5173"

# Test viewports
VIEWPORTS=(
    "1440x900:Desktop"
    "1024x768:Tablet"
    "768x1024:iPad"
    "375x667:iPhone"
    "414x896:iPhone Plus"
    "360x640:Android"
)

echo "🧪 Testing viewports:"
for viewport in "${VIEWPORTS[@]}"; do
    IFS=':' read -r size name <<< "$viewport"
    echo "  📐 $name ($size)"
done

echo ""
echo "🎯 Ready for MCP testing!"
echo "💡 Use the following commands in your MCP session:"
echo "   1. Navigate to http://localhost:5173"
echo "   2. Take screenshots at different viewport sizes"
echo "   3. Test interactions on mobile viewports"
echo ""
echo "📱 Recommended mobile viewport sizes:"
echo "   - Mobile: 375x667 (iPhone SE)"
echo "   - Tablet: 768x1024 (iPad)"
echo "   - Desktop: 1440x900 (MacBook)"

# Keep script running
echo "🔄 Script running... Press Ctrl+C to stop"
wait
