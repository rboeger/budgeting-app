import { useState } from 'react';
import { TrendingDown } from 'lucide-react';

export default function PaycheckToggle({ monthly4Week, monthlyAveraged, totalExpenses }) {
  const [useAveraged, setUseAveraged] = useState(false);

  const monthlyPaycheck = useAveraged ? monthlyAveraged : monthly4Week;
  const remaining = monthlyPaycheck - totalExpenses;
  const savingsRate = monthlyPaycheck > 0 ? (remaining / monthlyPaycheck) * 100 : 0;

  return (
    <div className="bg-slate-700 dark:bg-[#2d2d44] light:bg-slate-100 ultra-light:bg-white rounded-lg p-6 border border-slate-600 dark:border-[#3d3d54] light:border-slate-200 ultra-light:border-slate-300">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-slate-400 dark:text-[#a9b1d6] light:text-slate-600 ultra-light:text-slate-600 text-sm font-medium">
            Monthly Income
          </p>
          <p className="text-3xl font-bold text-white dark:text-[#c0caf5] light:text-slate-900 ultra-light:text-slate-900 mt-2">
            ${monthlyPaycheck.toFixed(2)}
          </p>
        </div>
        <TrendingDown
          className="text-green-400 dark:text-[#9ece6a] light:text-green-600 ultra-light:text-green-600"
          size={32}
        />
      </div>

      <div className="space-y-3">
        <div className="flex gap-2">
          <button
            onClick={() => setUseAveraged(false)}
            className={`flex-1 py-2 rounded font-medium transition ${
              !useAveraged
                ? 'bg-blue-500 dark:bg-[#7aa2f7] light:bg-blue-600 text-white'
                : 'bg-slate-600 dark:bg-[#1a1b26] light:bg-white text-slate-400 dark:text-[#a9b1d6] light:text-slate-600'
            }`}
          >
            4-Week
          </button>
          <button
            onClick={() => setUseAveraged(true)}
            className={`flex-1 py-2 rounded font-medium transition ${
              useAveraged
                ? 'bg-blue-500 dark:bg-[#7aa2f7] light:bg-blue-600 text-white'
                : 'bg-slate-600 dark:bg-[#1a1b26] light:bg-white text-slate-400 dark:text-[#a9b1d6] light:text-slate-600'
            }`}
          >
            Yearly Avg
          </button>
        </div>

        <div className="pt-2 border-t border-slate-600 dark:border-[#3d3d54] light:border-slate-300 ultra-light:border-slate-300">
          <p className="text-xs text-slate-400 dark:text-[#a9b1d6] light:text-slate-600 ultra-light:text-slate-600 mb-2">
            Remaining: <span className={remaining >= 0 ? 'text-green-400 dark:text-[#9ece6a] light:text-green-600 ultra-light:text-green-600' : 'text-red-400'}>
              ${remaining.toFixed(2)}
            </span>
          </p>
          <p className="text-xs text-slate-400 dark:text-[#a9b1d6] light:text-slate-600 ultra-light:text-slate-600">
            Savings Rate: <span className="text-purple-400 dark:text-[#bb9af7] light:text-purple-600 ultra-light:text-purple-600">{savingsRate.toFixed(1)}%</span>
          </p>
        </div>
      </div>
    </div>
  );
}
