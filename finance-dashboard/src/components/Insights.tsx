import { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { TrendingUp, TrendingDown, AlertCircle, Target, Calendar, DollarSign } from 'lucide-react';
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

const Insights = () => {
  const { transactions } = useApp();

  const insights = useMemo(() => {
    const currentMonth = new Date();
    const lastMonth = subMonths(currentMonth, 1);
    
    const currentMonthTransactions = transactions.filter(t =>
      isWithinInterval(new Date(t.date), {
        start: startOfMonth(currentMonth),
        end: endOfMonth(currentMonth)
      })
    );
    
    const lastMonthTransactions = transactions.filter(t =>
      isWithinInterval(new Date(t.date), {
        start: startOfMonth(lastMonth),
        end: endOfMonth(lastMonth)
      })
    );

    const currentExpenses = currentMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const lastExpenses = lastMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenseChange = lastExpenses !== 0 
      ? ((currentExpenses - lastExpenses) / lastExpenses) * 100 
      : 0;

    const categorySpending = new Map<string, number>();
    transactions.filter(t => t.type === 'expense').forEach(t => {
      categorySpending.set(t.category, (categorySpending.get(t.category) || 0) + t.amount);
    });

    const topCategory = Array.from(categorySpending.entries())
      .sort((a, b) => b[1] - a[1])[0];

    const avgTransaction = transactions.length > 0
      ? transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length
      : 0;

    const largestExpense = transactions
      .filter(t => t.type === 'expense')
      .sort((a, b) => b.amount - a.amount)[0];

    const monthlyAvgExpense = currentExpenses / new Date().getDate();
    const projectedMonthlyExpense = monthlyAvgExpense * 30;

    const currentIncome = currentMonthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const savingsRate = currentIncome > 0
      ? ((currentIncome - currentExpenses) / currentIncome) * 100
      : 0;

    return {
      topCategory,
      expenseChange,
      avgTransaction,
      largestExpense,
      projectedMonthlyExpense,
      currentExpenses,
      savingsRate
    };
  }, [transactions]);

  const insightCards = [
    {
      title: 'Highest Spending Category',
      value: insights.topCategory?.[0] || 'N/A',
      subtitle: insights.topCategory ? `$${insights.topCategory[1].toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '',
      icon: Target,
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950'
    },
    {
      title: 'Monthly Expense Trend',
      value: `${insights.expenseChange >= 0 ? '+' : ''}${insights.expenseChange.toFixed(1)}%`,
      subtitle: 'vs last month',
      icon: insights.expenseChange >= 0 ? TrendingUp : TrendingDown,
      gradient: insights.expenseChange >= 0 ? 'from-red-500 to-orange-500' : 'from-green-500 to-emerald-500',
      bgGradient: insights.expenseChange >= 0 
        ? 'from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950'
        : 'from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950'
    },
    {
      title: 'Average Transaction',
      value: `$${insights.avgTransaction.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      subtitle: 'across all transactions',
      icon: DollarSign,
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950'
    },
    {
      title: 'Projected Monthly Expense',
      value: `$${insights.projectedMonthlyExpense.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      subtitle: 'based on current trend',
      icon: Calendar,
      gradient: 'from-orange-500 to-red-500',
      bgGradient: 'from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950'
    },
    {
      title: 'Savings Rate',
      value: `${insights.savingsRate.toFixed(1)}%`,
      subtitle: 'of income saved',
      icon: TrendingUp,
      gradient: 'from-green-500 to-teal-500',
      bgGradient: 'from-green-50 to-teal-50 dark:from-green-950 dark:to-teal-950'
    },
    {
      title: 'Largest Expense',
      value: insights.largestExpense ? `$${insights.largestExpense.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : 'N/A',
      subtitle: insights.largestExpense?.category || '',
      icon: AlertCircle,
      gradient: 'from-red-500 to-pink-500',
      bgGradient: 'from-red-50 to-pink-50 dark:from-red-950 dark:to-pink-950'
    }
  ];

  const recommendations = [
    {
      title: 'Budget Optimization',
      description: insights.expenseChange > 10 
        ? 'Your expenses increased significantly this month. Consider reviewing your spending habits.'
        : 'Your spending is relatively stable. Keep up the good work!',
      type: insights.expenseChange > 10 ? 'warning' : 'success'
    },
    {
      title: 'Savings Goal',
      description: insights.savingsRate > 20
        ? 'Excellent savings rate! You\'re on track to meet your financial goals.'
        : 'Try to increase your savings rate to at least 20% for better financial health.',
      type: insights.savingsRate > 20 ? 'success' : 'info'
    },
    {
      title: 'Category Focus',
      description: insights.topCategory
        ? `${insights.topCategory[0]} is your highest spending category. Look for opportunities to optimize here.`
        : 'Start tracking your expenses to identify spending patterns.',
      type: 'info'
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Financial Insights</h2>
        <p className="text-gray-600 dark:text-gray-400">Understand your spending patterns and financial health</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {insightCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-900 shadow-lg hover:shadow-xl transition-all duration-300 animate-slide-up border border-gray-200 dark:border-gray-800"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${card.bgGradient} opacity-50`} />
              <div className="relative p-6">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${card.gradient} shadow-lg mb-4`}>
                  <Icon className="text-white" size={24} />
                </div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{card.title}</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{card.value}</p>
                {card.subtitle && (
                  <p className="text-sm text-gray-500 dark:text-gray-500">{card.subtitle}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-800 animate-slide-up" style={{ animationDelay: '600ms' }}>
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Recommendations</h3>
        <div className="space-y-4">
          {recommendations.map((rec, index) => (
            <div
              key={rec.title}
              className={`p-4 rounded-xl border-l-4 ${
                rec.type === 'success'
                  ? 'bg-green-50 dark:bg-green-950 border-green-500'
                  : rec.type === 'warning'
                  ? 'bg-orange-50 dark:bg-orange-950 border-orange-500'
                  : 'bg-blue-50 dark:bg-blue-950 border-blue-500'
              } animate-slide-up`}
              style={{ animationDelay: `${(index + 7) * 100}ms` }}
            >
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{rec.title}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">{rec.description}</p>
            </div>
          ))}
        </div>
      </div>

      {insights.largestExpense && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-800 animate-slide-up" style={{ animationDelay: '700ms' }}>
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Notable Transaction</h3>
          <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950 dark:to-pink-950 border border-red-200 dark:border-red-800">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                {format(new Date(insights.largestExpense.date), 'MMMM dd, yyyy')}
              </p>
              <p className="font-semibold text-gray-900 dark:text-white">{insights.largestExpense.description}</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">{insights.largestExpense.category}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                ${insights.largestExpense.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">Largest expense</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Insights;
