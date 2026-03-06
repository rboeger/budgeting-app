# Deployment Guide - PythonAnywhere

## Complete PythonAnywhere Setup

PythonAnywhere is ideal for this app: it handles both Flask backend and static React frontend hosting.

### Prerequisites
- PythonAnywhere account (free or paid tier)
- Git access to your repository

---

## Part 1: Deploy Backend on PythonAnywhere

### Step 1: Create Web App on PythonAnywhere

1. Log in to [PythonAnywhere](https://www.pythonanywhere.com)
2. Go to **Web** tab → Click **"Add a new web app"**
3. Choose your domain: `yourusername.pythonanywhere.com`
4. Select **Python 3.10** (or latest available)
5. Choose **Flask** as the framework
6. Complete the setup - it will create a basic Flask app

### Step 2: Clone Your Repository

1. Go to **Consoles** tab
2. Open **Bash console**
3. Clone your repo:
   ```bash
   cd ~
   git clone https://github.com/yourusername/budgeting-app.git
   cd budgeting-app
   ```

### Step 3: Set Up Python Virtual Environment

In the Bash console:

```bash
# Create virtual environment in your project
cd ~/budgeting-app/backend
python3.10 -m venv venv

# Activate it
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Step 4: Fix the WSGI Configuration

1. Go to **Web** tab
2. Click on your web app
3. Under **Code section**, find the **WSGI configuration file**
4. Click to edit `/var/www/yourusername_pythonanywhere_com_wsgi.py`

Replace the contents with:

```python
import sys
import os

# Add your project to the Python path
project_home = '/home/yourusername/budgeting-app/backend'
if project_home not in sys.path:
    sys.path.insert(0, project_home)

# Activate virtual environment
activate_this = '/home/yourusername/budgeting-app/backend/venv/bin/activate_this.py'
exec(open(activate_this).read(), {'__file__': activate_this})

# Set environment variables
os.environ['FLASK_ENV'] = 'production'
os.environ['PYTHONUNBUFFERED'] = '1'

# Import Flask app
from app import app as application
```

**Important:** Replace `yourusername` with your actual username!

### Step 5: Configure Environment Variables

Option A: In the WSGI file (already added `FLASK_ENV=production`)

Option B: Using .env file in backend folder:
1. Create `~/budgeting-app/backend/.env`:
   ```
   FLASK_ENV=production
   JWT_SECRET_KEY=your-secret-key-here
   ```

2. Update code to load .env:
   ```python
   from dotenv import load_dotenv
   load_dotenv()
   ```

### Step 6: Reload the Web App

1. Go to **Web** tab
2. Find your web app and click **Reload**
3. Wait for the green checkmark to appear

### Step 7: Test Your Backend

Visit `https://yourusername.pythonanywhere.com/api/health` (or test endpoint)

You should see a response from your Flask app.

### Step 8: Enable CORS

Add this to your Flask `app.py` to allow requests from your frontend:

```python
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={
    r"/api/*": {
        "origins": ["https://yourusername.pythonanywhere.com", "http://localhost:3000"],
        "allow_headers": ["Content-Type", "Authorization"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    }
})
```

Install flask-cors if not already installed:
```bash
pip install flask-cors
```

---

## Part 2: Deploy Frontend on PythonAnywhere

### Option 1: Serve React from Static Files (Recommended)

This serves the React build as static files from the same PythonAnywhere server.

#### Step 1: Build React for Production

```bash
cd ~/budgeting-app/frontend
npm run build
```

This creates `frontend/dist/` folder with all static files.

#### Step 2: Copy Frontend to Static Directory

Create a static folder in your project and copy the built files:

```bash
mkdir -p ~/budgeting-app/backend/static
cp -r ~/budgeting-app/frontend/dist/* ~/budgeting-app/backend/static/
```

#### Step 3: Update Flask to Serve Static Files

Add this to your Flask `app.py`:

```python
from flask import Flask, send_from_directory
import os

# ... existing code ...

# Serve React frontend
@app.route('/')
def serve_react_root():
    return send_from_directory('static', 'index.html')

@app.route('/<path:path>')
def serve_react(path):
    if path != "" and os.path.exists(os.path.join('static', path)):
        return send_from_directory('static', path)
    else:
        return send_from_directory('static', 'index.html')

# Your API routes...
@app.route('/api/...', methods=['GET', 'POST'])
def api_endpoint():
    # ... your code ...
```

#### Step 4: Update Frontend API URL

Edit `frontend/src/api.js`:

```javascript
const API_BASE = import.meta.env.DEV 
  ? 'http://localhost:5000/api' 
  : 'https://yourusername.pythonanywhere.com/api';
```

Rebuild and copy to static again:
```bash
cd ~/budgeting-app/frontend
npm run build
cp -r dist/* ../backend/static/
```

#### Step 5: Reload Web App

Go to **Web** tab and click **Reload**

Visit `https://yourusername.pythonanywhere.com` - you should see your React app!

---

### Option 2: Deploy Frontend Separately to GitHub Pages

If you prefer to keep frontend and backend separate:

#### Step 1: Update API Base URL

Edit `frontend/src/api.js`:

```javascript
const API_BASE = import.meta.env.DEV 
  ? 'http://localhost:5000/api' 
  : 'https://yourusername.pythonanywhere.com/api';
```

#### Step 2: Build Frontend

```bash
cd ~/budgeting-app/frontend
npm run build
```

#### Step 3: Deploy to GitHub Pages

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy Frontend to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json
      - run: cd frontend && npm ci && npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./frontend/dist
```

Access your app at: `https://yourusername.github.io/budgeting-app`

---

## Database: SQLite vs MySQL

### SQLite (Current - Recommended for free tier)
- Already configured in your app
- No additional setup needed
- File: `instance/budgeting.db` in your backend folder
- Works fine for small projects

### MySQL on PythonAnywhere (Optional)

If you want to upgrade to MySQL:

1. Go to **Databases** tab on PythonAnywhere
2. Click **Add new database**
3. Choose MySQL
4. Set password
5. Update your Flask config:
   ```python
   SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://yourusername:PASSWORD@yourusername.mysql.pythonanywhere-hosting.com/yourusername$dbname'
   ```

---

## Updating Your App

After making changes locally:

```bash
cd ~/budgeting-app
git pull origin main

# If you changed backend dependencies:
source backend/venv/bin/activate
pip install -r backend/requirements.txt

# If you changed frontend:
cd frontend
npm run build
cp -r dist/* ../backend/static/

# Reload web app from PythonAnywhere dashboard
```

---

## Troubleshooting

### See Error Logs
1. Go to **Web** tab
2. Scroll down to **Log files**
3. Click **Error log** to debug issues

### Database Errors
- Check file permissions: `chmod 755 ~/budgeting-app/backend/instance`
- Delete old database: `rm ~/budgeting-app/backend/instance/budgeting.db`
- Let Flask recreate it on next run

### CORS Errors
- Make sure backend CORS is configured correctly
- Check API URL in `frontend/src/api.js`
- Test with: `curl https://yourusername.pythonanywhere.com/api/health`

### Static Files Not Loading
- Rebuild frontend: `cd frontend && npm run build`
- Copy to static: `cp -r dist/* ../backend/static/`
- Clear browser cache (Ctrl+Shift+Delete)

---

## Environment Variables

### Backend (.env in backend folder)
```
FLASK_ENV=production
JWT_SECRET_KEY=your-secret-key-generate-one
DEBUG=False
```

### Generate Secure JWT Secret
```python
import secrets
print(secrets.token_urlsafe(32))
```

### Frontend
API endpoint is in `frontend/src/api.js` - no environment file needed, but you can use:
```
VITE_API_URL=https://your-backend.up.railway.app/api
```

Then update `api.js`:
```javascript
const API_BASE = import.meta.env.DEV 
  ? 'http://localhost:5000/api' 
  : import.meta.env.VITE_API_URL;
```

## Troubleshooting Deployment

### Frontend builds but won't load
- Check GitHub Pages is enabled in repo settings
- Clear browser cache
- Verify base path in vite.config.js matches your repo name

### Backend won't connect
- Check backend is actually running
- Verify CORS settings in backend/server.js
- Test API directly: `curl https://your-backend/api/health`

### Database issues
- Backend SQLite works out of the box
- If upgrading to PostgreSQL, just change connection string
- Data persists on Railway with PostgreSQL

### API endpoints returning 404
- Verify backend is deployed
- Check Routes in backend/server.js
- Try `/api/health` endpoint first to test connection

## Keeping Data Persistent

### SQLite (Current)
- Lives in `backend/` directory
- Persists as long as your backend is hosted
- Lost if backend moves between providers

### PostgreSQL (Recommended for production)
1. Add PostgreSQL to your Railway/Render project
2. Get connection string
3. Update backend to use postgres instead of sqlite:
   ```bash
   npm install pg
   ```
4. Update server.js to use postgres client

## Monitoring Your Deployment

### Railway
- Dashboard shows logs, CPU, memory
- Auto-redeploy on git push
- Can set up Slack notifications

### GitHub Actions
- Workflow status in repo → Actions tab
- Click workflow to see build logs
- Email notifications for failures

### Monitoring Services
- **UptimeRobot** - Free uptime monitoring
- **Sentry** - Error tracking
- **LogRocket** - Frontend monitoring

## Next Steps

1. ✅ Deploy backend to Railway
2. ✅ Deploy frontend to GitHub Pages
3. ⭐ Star the repo!
4. 📊 Add categories, expenses, and paychecks
5. 🎨 Customize theme colors
6. 🚀 (Optional) Add more features

## Getting Help

- Railway SSH: `railway run bash` to debug
- GitHub Actions: Check workflow logs
- Local testing: Run `npm run dev` in both frontend and backend
