import { describe, expect, it } from 'vitest';
import { calculateTotalCents, createExpense } from '../src/expenses.js';

describe('createExpense', () => {
  it('trims descriptions and converts decimal amounts to exact cents', () => {
    const expense = createExpense({
      description: '  Coffee  ',
      amount: '3.50',
      category: 'Food',
      date: '2026-11-24',
    });

    expect(expense).toMatchObject({
      description: 'Coffee',
      amountCents: 350,
      category: 'Food',
      date: '2026-11-24',
    });
    expect(expense.id).toBeTruthy();
  });

  it.each(['', '0', '-2.00', '2.345', '1e2'])(
    'rejects invalid amount %j',
    (amount) => {
      expect(() => createExpense({
        description: 'Lunch',
        amount,
        category: 'Food',
        date: '2026-11-24',
      })).toThrow();
    },
  );

  it('rejects blank descriptions and impossible calendar dates', () => {
    expect(() => createExpense({
      description: '   ',
      amount: '1.00',
      category: 'Food',
      date: '2026-11-24',
    })).toThrow('Enter a description.');

    expect(() => createExpense({
      description: 'Lunch',
      amount: '1.00',
      category: 'Food',
      date: '2026-02-30',
    })).toThrow('Choose a valid date.');
  });
});

describe('calculateTotalCents', () => {
  it('sums cents without floating-point rounding errors', () => {
    expect(calculateTotalCents([
      { amountCents: 10 },
      { amountCents: 20 },
      { amountCents: 999 },
    ])).toBe(1029);
  });
});
