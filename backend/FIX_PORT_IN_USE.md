# Fix: Port 5500 Already in Use

## Error Message
```
Error: listen EADDRINUSE: address already in use 0.0.0.0:5500
```

## What This Means
Port 5500 is already being used by another Node.js process (probably from a previous server start).

---

## Quick Fix (Choose One)

### Option 1: Use the Kill Script (Easiest)

```bash
# Run this script
kill-port-5500.bat

# Then start server
npm start
```

### Option 2: Manual Kill (Windows)

```bash
# Find the process
netstat -ano | findstr :5500

# You'll see something like:
# TCP    0.0.0.0:5500    0.0.0.0:0    LISTENING    12345
#                                                    ↑ This is the PID

# Kill the process (replace 12345 with actual PID)
taskkill /F /PID 12345

# Start server
npm start
```

### Option 3: Use Different Port

Edit `backend/.env`:
```env
PORT=5501
```

Then start server:
```bash
npm start
```

### Option 4: Restart Computer

If all else fails, restart your computer to clear all processes.

---

## Prevent This Issue

### Use Ctrl+C to Stop Server

Always stop the server properly with `Ctrl+C` instead of closing the terminal window.

### Check Before Starting

Before running `npm start`, check if port is in use:
```bash
netstat -ano | findstr :5500
```

If nothing shows up, port is free.

---

## Alternative: Use Nodemon (Auto-restart)

Nodemon is already installed. Use it for development:

```bash
npm run dev
```

This will:
- Auto-restart on file changes
- Handle port issues better
- Show better error messages

---

## Common Scenarios

### Scenario 1: Terminal Closed Without Stopping Server
**Problem:** Closed terminal window without pressing Ctrl+C  
**Solution:** Use kill script or manual kill

### Scenario 2: Multiple Terminals Running Server
**Problem:** Started server in multiple terminals  
**Solution:** Close all terminals, use kill script, restart

### Scenario 3: Server Crashed But Process Still Running
**Problem:** Server crashed but Node process didn't exit  
**Solution:** Use kill script or manual kill

---

## Verify Port is Free

```bash
# Check if port 5500 is in use
netstat -ano | findstr :5500

# If nothing shows, port is free
# If something shows, kill that process
```

---

## Start Server Correctly

```bash
# Option 1: Regular start
npm start

# Option 2: Development mode (auto-restart)
npm run dev

# Option 3: With custom port
PORT=5501 npm start
```

---

## Troubleshooting

### "Access Denied" when killing process
**Solution:** Run terminal as Administrator

### Port still in use after killing
**Solution:** Wait 10 seconds, then try again

### Can't find process ID
**Solution:** Use Task Manager:
1. Open Task Manager (Ctrl+Shift+Esc)
2. Find "Node.js" processes
3. End task

---

## Quick Reference

| Command | Purpose |
|---------|---------|
| `kill-port-5500.bat` | Kill process on port 5500 |
| `npm start` | Start server |
| `npm run dev` | Start with auto-restart |
| `netstat -ano \| findstr :5500` | Check port usage |
| `taskkill /F /PID <PID>` | Kill specific process |

---

## After Fixing

Once port is free:

1. Start server: `npm start`
2. Look for: `✓ Server running at http://localhost:5500`
3. Test: Open http://localhost:5500 in browser

---

**The port should now be free. Run `npm start` to start the server!**
