# 🎭 MCP Activation Guide for MealPrep

## Current Status
✅ **MCP Server**: Running on http://localhost:3001  
✅ **Dev Server**: Running on http://localhost:5173  
✅ **Configuration**: Properly set up in `.cursor/mcp-config.json`  
⚠️ **MCP Tools**: Not yet connected to Cursor

## 🚀 How to Activate MCP Tools in Cursor

### Method 1: Restart Cursor (Recommended)
1. **Save all your work**
2. **Quit Cursor completely** (Cmd+Q on Mac)
3. **Reopen Cursor** in your MealPrep project
4. **Wait 30 seconds** for MCP connections to establish
5. **Check for MCP tools** in the available functions

### Method 2: Manual MCP Connection
1. **Open Cursor Settings** (Cmd+,)
2. **Go to Extensions** → **MCP**
3. **Enable MCP servers**
4. **Restart Cursor**

### Method 3: Check MCP Status
1. **Look for MCP indicators** in Cursor's status bar
2. **Check if Playwright tools appear** in function calls
3. **Verify connection** by looking for `mcp__playwright__` prefixed tools

## 🎯 Expected MCP Tools (After Activation)

Once properly connected, you should see these tools available:

### **Navigation & Control**
```
mcp__playwright__browser_navigate
mcp__playwright__browser_resize
mcp__playwright__browser_close
```

### **Interaction & Testing**
```
mcp__playwright__browser_click
mcp__playwright__browser_type
mcp__playwright__browser_hover
mcp__playwright__browser_take_screenshot
```

### **Mobile Testing**
```
mcp__playwright__browser_resize (key for mobile testing)
```

## 🧪 Test MCP Connection

Once MCP is active, you can test it by asking me to:

```
"Navigate to http://localhost:5173 and take a screenshot"
```

If MCP is working, I'll be able to use the `mcp__playwright__browser_navigate` and `mcp__playwright__browser_take_screenshot` tools.

## 🔧 Troubleshooting

### MCP Tools Not Appearing?
1. **Check server status**: Both servers should be running
   ```bash
   curl http://localhost:3001  # MCP server
   curl http://localhost:5173  # Dev server
   ```

2. **Restart MCP server**:
   ```bash
   pnpm run test:full
   ```

3. **Check Cursor MCP settings**:
   - Ensure MCP is enabled
   - Verify `.cursor/mcp-config.json` exists
   - Restart Cursor completely

### Server Connection Issues?
1. **Kill existing processes**:
   ```bash
   pkill -f "@playwright/mcp"
   pkill -f "vite"
   ```

2. **Restart everything**:
   ```bash
   pnpm run test:full
   ```

## 🎨 Design Review Agent Usage

Once MCP is active, you can use the design review agent by saying:

```
"Review the design of the meal planning wizard"
```

The agent will automatically:
1. Navigate to your app
2. Test desktop viewport (1440x900)
3. Resize to tablet (768x1024)
4. Resize to mobile (375x667)
5. Take screenshots at each size
6. Test interactions and accessibility
7. Provide detailed feedback with priority levels

## 📱 Mobile Testing Workflow

With MCP active, I can:

1. **Navigate to your app**
2. **Test desktop view** - Take screenshot
3. **Resize to tablet** - Test layout adaptation
4. **Resize to mobile** - Test touch interactions
5. **Verify accessibility** - Check focus states, keyboard navigation
6. **Generate report** - With screenshots and priority-categorized issues

## 🎯 Next Steps

1. **Restart Cursor** to activate MCP tools
2. **Test the connection** by asking for a screenshot
3. **Use the design review agent** for comprehensive testing
4. **Iterate on your design** based on the feedback

---

**Current servers are running and ready! Just need Cursor to connect to the MCP server.**

