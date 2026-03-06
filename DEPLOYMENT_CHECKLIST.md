# PythonAnywhere Deployment Checklist

## Quick Summary

Your app has **two layers**:
- **Backend**: Flask API + Database (runs on PythonAnywhere)
- **Frontend**: React app (must be built locally, then served by Flask)

---

## Step-by-Step Deployment

### 1. Build Frontend Locally (your machine)
```bash
cd frontend
npm run build
cp -r dist/* ../backend/static/
```

### 2. Push to GitHub (your machine)
```bash
git add backend/static/
git commit -m "Add built frontend"
git push origin main
```

### 3. Pull on PythonAnywhere
```bash
cd ~/budgeting-app
git pull origin main
```

### 4. Reload Web App
- Go to **Web** tab on PythonAnywhere
- Click your web app
- Click **Reload**
- Wait for green checkmark ✓

---

## Testing

### Test Backend Health
Visit in browser:
```
https://yourusername.pythonanywhere.com/api/health
```
Should return: `{"status":"ok"}`

### Test Frontend
Visit in browser:
```
https://yourusername.pythonanywhere.com
```
Should load the login page.

---

## If Something Breaks

Check **Error log** on PythonAnywhere:
- Go to **Web** tab → your app → **Error log** (bottom)
- Shows latest errors with line numbers

**Common issues:**
- `ModuleNotFoundError`: Run `source venv/bin/activate && pip install -r requirements.txt`
- `static/index.html not found`: Verify `backend/static/index.html` exists
- "No such file": Check WSGI path has correct username

---

## Why npm Isn't on PythonAnywhere

PythonAnywhere is for **running** your app, not **building** it. Think of it like:
- Your local machine = **development** (has npm, python, tools)
- PythonAnywhere = **production** (just runs Flask with pre-built files)

Always build locally, then deploy the results.
