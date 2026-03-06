# Budget Dashboard

A professional, responsive budgeting webapp to manage your personal finances. Create expense categories, track recurring payments, visualize spending patterns, and analyze your income vs. expenses.

## Features

✨ **Category Management** - Create custom expense categories with color coding
💰 **Expense Tracking** - Add recurring expenses with flexible frequencies (weekly, monthly, yearly)
📊 **Visual Dashboard** - Pie chart showing expense breakdown by category
💵 **Income Tracking** - Add paychecks with weekly or biweekly frequency
🔄 **Income Calculation Modes** - Toggle between 4-week average and yearly average income
🌓 **Dark/Light Theme** - Beautiful Catppuccin-inspired dark theme and openSUSE-inspired light theme
📱 **Fully Responsive** - Works seamlessly on mobile, tablet, and desktop
⚡ **Fast & Modern** - Built with React, Vite, and Tailwind CSS

## Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool for fast development
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Charting library for visualization
- **Lucide React** - Icon library

### Backend
- **Node.js + Express** - Server framework
- **SQLite** - Lightweight database
- **CORS** - Cross-origin support

## Project Structure

```
budgeting-app/
├── frontend/              # React app
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── App.jsx       # Main app component
│   │   ├── api.js        # API client
│   │   ├── hooks.js      # Custom React hooks
│   │   └── index.css     # Global styles
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
├── backend/              # Express server
│   ├── server.js         # Main server file
│   ├── package.json
│   └── .env.example
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 16+ and npm

### Local Development

#### 1. Clone and Install Dependencies

```bash
cd budgeting-app

# Backend setup
cd backend
npm install
cp .env.example .env

# Frontend setup
cd ../frontend
npm install
```

#### 2. Start Backend Server

From the `backend` directory:

```bash
npm run dev
```

The API will be available at `http://localhost:5000`

#### 3. Start Frontend Development Server

From the `frontend` directory:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Building for Production

#### Build Frontend

```bash
cd frontend
npm run build
```

This creates a `dist/` folder with optimized static files.

#### Build Backend

The backend is ready for deployment as-is. The `server.js` file is production-ready.

## Deployment

### Backend Deployment

The backend can be deployed to services that support Node.js:

**Recommended Options:**
- **Railway** (free tier available) - https://railway.app
- **Render** (free tier available) - https://render.com
- **Heroku** (paid, but simple) - https://heroku.com
- **Fly.io** - https://fly.io

**Steps for Railway (recommended):**
1. Push code to GitHub
2. Connect your GitHub repo to Railway
3. Create a new project
4. Select the `backend` directory as the root
5. Add environment variables (PORT, NODE_ENV)
6. Railway will automatically deploy on push

**Environment Variables for Production:**
```
PORT=5000
NODE_ENV=production
```

Get your backend URL after deployment (e.g., `https://your-app.railway.app`)

### Frontend Deployment (GitHub Pages)

The frontend is configured to deploy to GitHub Pages automatically.

**Setup GitHub Pages:**

1. Push your code to a GitHub repository
2. Go to repository Settings → Pages
3. Select "Deploy from a branch"
4. Choose the branch where you want to deploy from
5. Create a GitHub Actions workflow (see below)

**Update API Endpoint:**

In `frontend/src/api.js`, update the API endpoint:

```javascript
const API_BASE = import.meta.env.DEV 
  ? 'http://localhost:5000/api' 
  : 'https://your-backend-url.railway.app/api'; // Update this
```

**Create GitHub Actions Workflow:**

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy Frontend

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: cd frontend && npm install
      
      - name: Build
        run: cd frontend && npm run build
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./frontend/dist
          cname: yourdomain.com (optional)
```

## Theme Configuration

### Dark Mode (Tokyo Night inspired)
- Background: `#1a1b26`
- Surface: `#16161e`
- Text: `#c0caf5`
- Accent Blue: `#7aa2f7`
- Accent Purple: `#bb9af7`
- Accent Green: `#9ece6a`

### Light Mode (openSUSE/Fedora inspired)
- Background: `#f5f5f5`
- Surface: `#ffffff`
- Text: `#1a1a1a`
- Accent Blue: `#0066cc`
- Accent Pink: `#cc0066`
- Accent Green: `#009900`

Theme preference is saved to localStorage and persists across sessions.

## API Endpoints

### Categories
- `GET /api/categories` - List all categories
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Expenses
- `GET /api/expenses` - List all expenses
- `GET /api/expenses/category/:categoryId` - Get expenses by category
- `POST /api/expenses` - Create expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Paychecks
- `GET /api/paychecks` - List all paychecks
- `POST /api/paychecks` - Create paycheck
- `DELETE /api/paychecks/:id` - Delete paycheck

## Monthly Calculation Logic

### Expenses
- **Weekly**: `(amount * 52) / 12` = monthly equivalent
- **Monthly**: `amount` = already monthly
- **Yearly**: `amount / 12` = monthly equivalent

### Paychecks (4-week calculation)
- **Weekly**: `amount * 4` = monthly
- **Biweekly**: `amount * 2` = monthly

### Paychecks (Yearly average)
- **Weekly**: `(amount * 52) / 12` = monthly average
- **Biweekly**: `(amount * 26) / 12` = monthly average

The yearly average accounts for the 4 extra weeks in a year, giving you a more realistic picture of monthly income.

## Usage Tips

1. **Start with Categories** - Create your expense categories first (Bills, Subscriptions, Wants, etc.)
2. **Add Expenses** - Add recurring expenses to each category
3. **Add Income** - Add your paycheck(s) to see if your budget is sustainable
4. **Toggle Income Mode** - Use the toggle on the dashboard to see different income scenarios
5. **Monitor Savings** - The dashboard shows your remaining balance after expenses
6. **Review Breakdown** - Use the pie chart to see where your money is going

## Troubleshooting

### Backend won't connect
- Ensure backend is running on port 5000
- Check CORS is properly configured
- Verify database file exists (`backend/budget.db`)

### Theme not applying
- Clear browser cache/localStorage
- Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

### Pie chart not showing
- Ensure you have at least one category with expenses
- Check browser console for errors

## Future Enhancements

- User authentication
- Cloud sync across devices
- Budget goals and alerts
- Recurring expense templates
- CSV export
- Mobile app version
- Forecasting and analytics

## License

MIT

## Support

For issues or feature requests, please create a GitHub issue.
