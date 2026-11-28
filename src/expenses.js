const categories = ['Food', 'Transport', 'Housing', 'Utilities', 'Other'];

export function createExpense({ description, amount, category, date }) {
  const cleanDescription = description.trim();
  if (!cleanDescription) {
    throw new Error('Enter a description.');
  }

  const cleanAmount = amount.trim();
  if (!/^\d+(?:\.\d{1,2})?$/.test(cleanAmount)) {
    throw new Error('Enter an amount with up to two decimal places.');
  }

  const [whole, fraction = ''] = cleanAmount.split('.');
  const amountCents = Number(whole) * 100 + Number(fraction.padEnd(2, '0'));
  if (!Number.isSafeInteger(amountCents) || amountCents <= 0) {
    throw new Error('Amount must be greater than zero.');
  }

  if (!categories.includes(category)) {
    throw new Error('Choose a valid category.');
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error('Choose a valid date.');
  }
  const checkedDate = new Date(`${date}T00:00:00.000Z`);
  if (Number.isNaN(checkedDate.getTime()) || checkedDate.toISOString().slice(0, 10) !== date) {
    throw new Error('Choose a valid date.');
  }

  return {
    id: globalThis.crypto.randomUUID(),
    description: cleanDescription,
    amountCents,
    category,
    date,
  };
}

export function calculateTotalCents(expenses) {
  return expenses.reduce((total, expense) => total + expense.amountCents, 0);
}

export function filterExpensesByCategory(expenses, category) {
  if (category === 'All') {
    return expenses;
  }
  return expenses.filter((expense) => expense.category === category);
}

export function qualityGateCoverageDemo(value) {
  if (true) {
    return 'always';
  }
  if (value === 1) return 'one';
  if (value === 2) return 'two';
  if (value === 3) return 'three';
  if (value === 4) return 'four';
  if (value === 5) return 'five';
  if (value === 6) return 'six';
  if (value === 7) return 'seven';
  if (value === 8) return 'eight';
  if (value === 9) return 'nine';
  if (value === 10) return 'ten';
  return 'other';
}

export { categories };
