# MCP (Model Context Protocol) Setup for MealPrep

This guide explains how to configure and use the Playwright MCP server for automated design reviews and testing in your MealPrep project.

## 🚀 Quick Start

### 1. Start the MCP Server
```bash
# Start the MCP server in headed mode
pnpm run mcp:start

# Or manually
./scripts/start-mcp.sh
```

### 2. Start Mobile Testing Environment
```bash
# Start dev server and prepare mobile testing
pnpm run mcp:test-mobile

# Or manually
./scripts/test-mobile-responsive.sh
```

## 📁 Configuration Files

### `.cursor/mcp-config.json`
Main MCP configuration file that Cursor uses to connect to the Playwright MCP server.

**Key Features:**
- Runs in **headed mode** (visual browser window)
- Default viewport: 1440x900 (desktop)
- Output directory: `./playwright-output`
- Saves sessions and traces for debugging

### `scripts/start-mcp.sh`
Launch script for the MCP server with optimized settings.

**Features:**
- Visual browser testing (headed mode)
- Chrome browser for consistency
- Extended timeouts for development
- Permission grants for clipboard, geolocation

### `scripts/test-mobile-responsive.sh`
Comprehensive mobile testing setup script.

**Supported Viewports:**
- Desktop: 1440x900 (MacBook)
- Tablet: 768x1024 (iPad)
- Mobile: 375x667 (iPhone SE)
- Mobile Plus: 414x896 (iPhone Plus)
- Android: 360x640

## 🎯 Using the Design Review Agent

### Agent Configuration
The design review agent is configured in `.cursor/agents/design-review.md` with:

**Tools Available:**
- All Playwright MCP browser automation tools
- Screenshot capture for visual evidence
- Viewport resizing for responsive testing
- Console monitoring for error detection

**Testing Protocol:**
1. **Desktop Testing** (1440x900)
2. **Tablet Testing** (768x1024) 
3. **Mobile Testing** (375x667, 414x896, 360x640)
4. **Accessibility Testing** (WCAG 2.1 AA)
5. **Visual Polish Review**
6. **Code Health Check**

### Example Usage
```
Review the design changes in the meal planning wizard
```

The agent will:
1. Start the MCP server
2. Navigate to your app
3. Test across multiple viewports
4. Capture screenshots as evidence
5. Provide detailed feedback with priority levels

## 🛠️ MCP Tools Available

### Navigation & Interaction
- `mcp__playwright__browser_navigate` - Navigate to URLs
- `mcp__playwright__browser_click` - Click elements
- `mcp__playwright__browser_type` - Type text
- `mcp__playwright__browser_hover` - Hover over elements

### Visual Testing
- `mcp__playwright__browser_take_screenshot` - Capture screenshots
- `mcp__playwright__browser_snapshot` - Accessibility snapshot
- `mcp__playwright__browser_resize` - Change viewport size

### Mobile Testing
- `mcp__playwright__browser_resize` - Switch between desktop/tablet/mobile
- Touch interaction testing
- Tap target verification (44px minimum)

### Debugging
- `mcp__playwright__browser_console_messages` - Check for errors
- Session and trace saving in `./playwright-output`

## 📱 Mobile Testing Workflow

### 1. Desktop First
```bash
# Start with desktop viewport
mcp__playwright__browser_resize(width=1440, height=900)
mcp__playwright__browser_take_screenshot(filename="desktop-view.png")
```

### 2. Tablet Testing
```bash
# Resize to tablet
mcp__playwright__browser_resize(width=768, height=1024)
mcp__playwright__browser_take_screenshot(filename="tablet-view.png")
```

### 3. Mobile Testing
```bash
# Resize to mobile
mcp__playwright__browser_resize(width=375, height=667)
mcp__playwright__browser_take_screenshot(filename="mobile-view.png")

# Test touch interactions
mcp__playwright__browser_click(element="button")
```

## 🔧 Troubleshooting

### MCP Server Won't Start
```bash
# Check if port 3001 is available
lsof -i :3001

# Kill any existing processes
pkill -f "@playwright/mcp"

# Restart the server
pnpm run mcp:start
```

### Browser Not Opening
- Ensure Chrome is installed
- Check if running in headed mode (no `--headless` flag)
- Verify viewport size settings

### Permission Issues
```bash
# Make scripts executable
chmod +x scripts/*.sh
```

## 📊 Output Files

All MCP testing outputs are saved in `./playwright-output/`:
- **Screenshots**: Visual evidence of issues
- **Traces**: Detailed browser interaction logs
- **Sessions**: Browser state for debugging

## 🎨 Design Review Standards

The design review agent follows these standards:
- **Live Environment First** - Always test the actual app
- **Mobile-First Responsive** - Test all viewport sizes
- **Accessibility Compliance** - WCAG 2.1 AA standards
- **Evidence-Based** - Screenshots for all issues
- **Priority-Based** - Blocker, High, Medium, Nitpick categories

## 🚀 Next Steps

1. **Start the MCP server**: `pnpm run mcp:start`
2. **Test your app**: Use the design review agent
3. **Iterate**: Fix issues and re-test
4. **Automate**: Integrate with your CI/CD pipeline

For more advanced usage, see the [Playwright MCP documentation](https://github.com/microsoft/playwright-mcp).
