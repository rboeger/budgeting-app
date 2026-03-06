# Quick Start Guide

## 30-Second Setup

### Start Backend
```bash
cd backend
npm start
```
Backend runs on `http://localhost:5000`

### Start Frontend (in a new terminal)
```bash
cd frontend
npm run dev
```
Frontend runs on `http://localhost:5173`

Visit http://localhost:5173 and start budgeting! 🎉

## What You Can Do Right Now

1. **Create Categories** - Go to "Categories" tab
   - Add: Bills, Subscriptions, Wants, Needs, Savings Goals, etc.
   - Pick a color for each

2. **Add Expenses** - Go to "Expenses" tab
   - Add expenses to your categories
   - Choose frequency: Weekly, Monthly, or Yearly
   - Examples:
     - Netflix (Subscriptions, $15/month)
     - Rent (Bills, $1200/month)
     - Gym (Wants, $20/week)

3. **Add Paychecks** - Go to "Paychecks" tab
   - Add your paycheck amount and frequency
   - Toggle between 4-week and yearly average
   - See how much you can save!

4. **View Dashboard** - Main tab shows everything
   - Total monthly expenses
   - Income vs. expenses
   - Pie chart of spending
   - Category breakdown

## Theme Toggle

Click the moon/sun icon in the top-right to switch between dark and light themes. Your preference is saved!

## File Layout

```
budgeting-app/
├── backend/          # Node.js/Express server + SQLite
├── frontend/         # React app with Vite
├── README.md         # Full documentation
└── DEPLOYMENT.md     # How to deploy
```

## Next: Deployment

When ready to deploy:
1. Follow [DEPLOYMENT.md](./DEPLOYMENT.md)
2. 5 minutes to deploy to Railway + GitHub Pages
3. Share with anyone!

## Features Implemented ✅

- ✅ Category management with colors
- ✅ Expense tracking (weekly/monthly/yearly)
- ✅ Automatic monthly conversion
- ✅ Paycheck tracking
- ✅ 4-week vs yearly average toggle
- ✅ Beautiful pie chart
- ✅ Category breakdown
- ✅ Dark/Light themes (Catppuccin/openSUSE inspired)
- ✅ Fully responsive design
- ✅ Local backend database
- ✅ Professional UI with Tailwind CSS

## Customization

### Colors
Edit `frontend/tailwind.config.js` to customize the theme colors

### Dark Mode
Currently uses Tokyo Night inspiration. Change colors in:
```javascript
dark: {
  bg: '#1a1b26',
  surface: '#16161e',
  // ... etc
}
```

### Light Mode
Change in the same file:
```javascript
light: {
  bg: '#f5f5f5',
  surface: '#ffffff',
  // ... etc
}
```

## Keyboard Tips

- Focus input fields with Tab
- Press Enter to submit forms
- Click category color squares to change colors

## Need Help?

- Check [README.md](./README.md) for detailed docs
- Check [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment
- Backend logs show in terminal where you ran `npm start`
- Frontend errors show in browser console (F12)

## Next Steps

1. Run the app locally
2. Test all features
3. Deploy to Railway + GitHub Pages (5 min)
4. Share your budget app!

---

**Happy budgeting! 💰**
