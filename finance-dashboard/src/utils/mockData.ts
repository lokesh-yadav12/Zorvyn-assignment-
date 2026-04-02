import { Transaction } from '../types';

const categories = {
  income: ['Salary', 'Freelance', 'Investment', 'Bonus', 'Other Income'],
  expense: ['Food & Dining', 'Shopping', 'Transportation', 'Bills & Utilities', 'Entertainment', 'Healthcare', 'Education', 'Travel']
};

const merchants = {
  'Food & Dining': ['Starbucks', 'McDonald\'s', 'Whole Foods', 'Local Restaurant', 'Pizza Hut'],
  'Shopping': ['Amazon', 'Target', 'Walmart', 'Best Buy', 'Apple Store'],
  'Transportation': ['Uber', 'Gas Station', 'Metro Card', 'Parking'],
  'Bills & Utilities': ['Electric Company', 'Internet Provider', 'Water Company', 'Phone Bill'],
  'Entertainment': ['Netflix', 'Spotify', 'Cinema', 'Gaming Store'],
  'Healthcare': ['Pharmacy', 'Doctor Visit', 'Gym Membership'],
  'Education': ['Online Course', 'Books', 'Tuition'],
  'Travel': ['Airline', 'Hotel', 'Airbnb']
};

export const generateMockTransactions = (): Transaction[] => {
  const transactions: Transaction[] = [];
  const today = new Date();
  
  for (let i = 0; i < 100; i++) {
    const daysAgo = Math.floor(Math.random() * 180);
    const date = new Date(today);
    date.setDate(date.getDate() - daysAgo);
    
    const type = Math.random() > 0.7 ? 'income' : 'expense';
    const categoryList = categories[type];
    const category = categoryList[Math.floor(Math.random() * categoryList.length)];
    
    let amount: number;
    if (type === 'income') {
      amount = Math.floor(Math.random() * 5000) + 1000;
    } else {
      amount = Math.floor(Math.random() * 500) + 10;
    }
    
    const merchant = type === 'expense' && merchants[category as keyof typeof merchants]
      ? merchants[category as keyof typeof merchants][Math.floor(Math.random() * merchants[category as keyof typeof merchants].length)]
      : undefined;
    
    transactions.push({
      id: `txn_${i}_${Date.now()}`,
      date: date.toISOString().split('T')[0],
      amount,
      category,
      type,
      description: type === 'income' ? `${category} payment` : `Purchase at ${merchant || category}`,
      merchant
    });
  }
  
  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};
