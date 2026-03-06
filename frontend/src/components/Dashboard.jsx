import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, TrendingUp } from 'lucide-react';
import PaycheckToggle from './PaycheckToggle';

const COLORS = [
  '#7aa2f7', // Tokyo Night Blue
  '#bb9af7', // Tokyo Night Purple
  '#9ece6a', // Tokyo Night Green
  '#ff9e64', // Tokyo Night Orange
  '#f7768e', // Tokyo Night Pink
  '#0066cc', // Light Blue
  '#cc0066', // Light Pink
  '#009900', // Light Green
  '#ff6600', // Light Orange
  '#993399', // Light Purple
];

export default function Dashboard({ categories, expenses, paychecks, creditCards }) {
  // Calculate monthly expenses per category
  const calculateMonthlyAmount = (amount, frequency) => {
    switch (frequency) {
      case 'weekly':
        return (amount * 52) / 12; // 52 weeks a year / 12 months
      case 'monthly':
        return amount;
      case 'yearly':
        return amount / 12;
      default:
        return 0;
    }
  };

  // Calculate credit card monthly payments
  const calculateCreditCardPayment = (balance, annualRate, payoffDate) => {
    const principal = parseFloat(balance) || 0;
    const annualRatePercent = parseFloat(annualRate) || 0;
    const monthlyRate = annualRatePercent / 100 / 12;

    const today = new Date();
    const payoff = new Date(payoffDate);
    const monthsDiff =
      (payoff.getFullYear() - today.getFullYear()) * 12 +
      (payoff.getMonth() - today.getMonth());

    if (monthsDiff <= 0) {
      return 0;
    }

    if (monthlyRate === 0) {
      return principal / monthsDiff;
    }

    const numerator = principal * (monthlyRate * Math.pow(1 + monthlyRate, monthsDiff));
    const denominator = Math.pow(1 + monthlyRate, monthsDiff) - 1;
    return numerator / denominator;
  };

  const categoryTotals = categories.data.map((category) => {
    const categoryExpenses = expenses.data.filter(
      (exp) => exp.categoryId === category.id
    );
    const total = categoryExpenses.reduce(
      (sum, exp) => sum + calculateMonthlyAmount(exp.amount, exp.frequency),
      0
    );
    return {
      id: category.id,
      name: category.name,
      amount: Math.round(total * 100) / 100,
      color: category.color,
    };
  });

  // Calculate total credit card payments
  const totalCreditCardPayment = creditCards.data.reduce(
    (sum, card) =>
      sum + calculateCreditCardPayment(card.balance, card.interestRate, card.payoffDate),
    0
  );

  // Add credit cards as a category if there are any
  if (creditCards.data.length > 0 && totalCreditCardPayment > 0) {
    categoryTotals.push({
      id: 'credit-cards',
      name: 'Credit Cards',
      amount: Math.round(totalCreditCardPayment * 100) / 100,
      color: '#f7768e', // Pink/red color
    });
  }

  const totalExpenses = categoryTotals.reduce((sum, cat) => sum + cat.amount, 0);

  // Calculate percentages for pie chart
  const categoryPercentages = categoryTotals.map((cat) => ({
    ...cat,
    percentage: totalExpenses > 0 ? Math.round((cat.amount / totalExpenses) * 100 * 10) / 10 : 0,
    value: totalExpenses > 0 ? (cat.amount / totalExpenses) * 100 : 0,
  }));

  // Calculate paychecks
  const calculateMonthlyPaycheck = (amount, frequency, all = false) => {
    if (frequency === 'weekly') {
      if (all) {
        // Averaged over the year accounting for extra weeks
        return (amount * 52) / 12;
      } else {
        // 4-week average (doesn't account for extra weeks)
        return amount * 4;
      }
    } else if (frequency === 'biweekly') {
      if (all) {
        // Averaged over the year
        return (amount * 26) / 12;
      } else {
        // 2 paychecks per month (4-week average)
        return amount * 2;
      }
    }
    return 0;
  };

  const monthlyPaycheck4Week = paychecks.data.reduce(
    (sum, check) => sum + calculateMonthlyPaycheck(check.amount, check.frequency, false),
    0
  );

  const monthlyPaycheckAveraged = paychecks.data.reduce(
    (sum, check) => sum + calculateMonthlyPaycheck(check.amount, check.frequency, true),
    0
  );

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-700 dark:bg-[#2d2d44] light:bg-slate-100 rounded-lg p-6 border border-slate-600 dark:border-[#3d3d54] light:border-slate-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-400 dark:text-[#a9b1d6] light:text-slate-600 text-sm font-medium">
                Total Monthly Expenses
              </p>
              <p className="text-3xl font-bold text-white dark:text-[#c0caf5] light:text-slate-900 ultra-light:text-slate-900 mt-2">
                ${totalExpenses.toFixed(2)}
              </p>
            </div>
            <DollarSign className="text-blue-400 dark:text-[#7aa2f7] light:text-blue-600 ultra-light:text-blue-600" size={32} />
          </div>
        </div>

        <PaycheckToggle
          monthly4Week={monthlyPaycheck4Week}
          monthlyAveraged={monthlyPaycheckAveraged}
          totalExpenses={totalExpenses}
        />

        <div className="bg-slate-700 dark:bg-[#2d2d44] light:bg-slate-100 ultra-light:bg-white rounded-lg p-6 border border-slate-600 dark:border-[#3d3d54] light:border-slate-200 ultra-light:border-slate-300">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-400 dark:text-[#a9b1d6] light:text-slate-600 ultra-light:text-slate-600 text-sm font-medium">
                Total Categories
              </p>
              <p className="text-3xl font-bold text-white dark:text-[#c0caf5] light:text-slate-900 ultra-light:text-slate-900 mt-2">
                {categories.data.length}
              </p>
            </div>
            <TrendingUp className="text-purple-400 dark:text-[#bb9af7] light:text-purple-600 ultra-light:text-purple-600" size={32} />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-slate-700 dark:bg-[#2d2d44] light:bg-slate-100 ultra-light:bg-white rounded-lg p-6 border border-slate-600 dark:border-[#3d3d54] light:border-slate-200 ultra-light:border-slate-300">
          <h2 className="text-lg font-bold text-white dark:text-[#c0caf5] light:text-slate-900 ultra-light:text-slate-900 mb-4">
            Expense Breakdown
          </h2>
          {categoryPercentages.length > 0 && totalExpenses > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryPercentages}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name} (${percentage}%)`}
                  outerRadius={80}
                  innerRadius={40}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryPercentages.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-slate-500 dark:text-[#a9b1d6] light:text-slate-500 ultra-light:text-slate-500">
              No expenses to display
            </div>
          )}
        </div>

        {/* Category Breakdown */}
        <div className="bg-slate-700 dark:bg-[#2d2d44] light:bg-slate-100 ultra-light:bg-white rounded-lg p-6 border border-slate-600 dark:border-[#3d3d54] light:border-slate-200 ultra-light:border-slate-300">
          <h2 className="text-lg font-bold text-white dark:text-[#c0caf5] light:text-slate-900 ultra-light:text-slate-900 mb-4">
            Category Details
          </h2>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {categoryTotals.length > 0 ? (
              categoryTotals.map((cat, idx) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between p-3 bg-slate-600 dark:bg-[#1a1b26] light:bg-white ultra-light:bg-slate-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                    />
                    <div>
                      <span className="font-medium text-white dark:text-[#c0caf5] light:text-slate-900">
                        {cat.name}
                      </span>
                      <span className="text-xs text-slate-400 dark:text-[#a9b1d6] light:text-slate-600 ml-2">
                        ({categoryPercentages[idx]?.percentage || 0}%)
                      </span>
                    </div>
                  </div>
                  <span className="font-bold text-green-400 dark:text-[#9ece6a] light:text-green-600">
                    ${cat.amount.toFixed(2)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-slate-500 dark:text-[#a9b1d6] light:text-slate-500">
                Add categories and expenses to see breakdown
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
