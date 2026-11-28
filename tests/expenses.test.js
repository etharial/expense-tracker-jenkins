import { describe, expect, it } from 'vitest';
import {
  calculateTotalCents,
  categories,
  createExpense,
} from '../src/expenses.js';

const validExpense = {
  description: 'Lunch',
  amount: '12.50',
  category: 'Food',
  date: '2026-11-24',
};

describe('createExpense valid inputs', () => {
  it('trims descriptions and converts decimal amounts to exact cents', () => {
    const expense = createExpense({
      ...validExpense,
      description: '  Coffee  ',
      amount: '3.50',
    });

    expect(expense).toMatchObject({
      description: 'Coffee',
      amountCents: 350,
      category: 'Food',
      date: '2026-11-24',
    });

    expect(expense.id).toBeTruthy();
  });

  it.each([
    ['12', 1200],
    ['12.5', 1250],
    ['12.50', 1250],
    ['0.01', 1],
    [' 4.25 ', 425],
    ['001.50', 150],
  ])('converts %j to %i cents', (amount, expected) => {
    expect(
      createExpense({ ...validExpense, amount }).amountCents,
    ).toBe(expected);
  });

  it.each(categories)(
    'accepts the supported category %s',
    (category) => {
      expect(
        createExpense({ ...validExpense, category }).category,
      ).toBe(category);
    },
  );

  it('accepts a valid leap-year date', () => {
    const expense = createExpense({
      ...validExpense,
      date: '2024-02-29',
    });

    expect(expense.date).toBe('2024-02-29');
  });

  it('generates a unique ID for each expense', () => {
    const first = createExpense(validExpense);
    const second = createExpense(validExpense);

    expect(first.id).not.toBe(second.id);
  });
});

describe('createExpense invalid inputs', () => {
  it.each([
    '',
    '-2.00',
    '2.345',
    '1e2',
    'abc',
    'NaN',
    'Infinity',
    '.50',
    '2.',
  ])('rejects invalid amount format %j', (amount) => {
    expect(() =>
      createExpense({ ...validExpense, amount }),
    ).toThrow('Enter an amount with up to two decimal places.');
  });

  it.each(['0', '0.00', '0.0'])(
    'rejects a zero amount %j',
    (amount) => {
      expect(() =>
        createExpense({ ...validExpense, amount }),
      ).toThrow('Amount must be greater than zero.');
    },
  );

  it('rejects an amount outside the safe integer range', () => {
    expect(() =>
      createExpense({
        ...validExpense,
        amount: '90071992547410.00',
      }),
    ).toThrow('Amount must be greater than zero.');
  });

  it.each(['', '   '])(
    'rejects a blank description %j',
    (description) => {
      expect(() =>
        createExpense({ ...validExpense, description }),
      ).toThrow('Enter a description.');
    },
  );

  it.each(['Entertainment', 'Unknown', '', 'food'])(
    'rejects an unsupported category %j',
    (category) => {
      expect(() =>
        createExpense({ ...validExpense, category }),
      ).toThrow('Choose a valid category.');
    },
  );

  it.each([
    '',
    '11/24/2026',
    '2026-1-1',
    'not-a-date',
  ])('rejects malformed date %j', (date) => {
    expect(() =>
      createExpense({ ...validExpense, date }),
    ).toThrow('Choose a valid date.');
  });

  it.each([
    '2026-02-30',
    '2025-02-29',
    '2026-13-01',
    '2026-00-10',
    '2026-04-31',
  ])('rejects impossible date %j', (date) => {
    expect(() =>
      createExpense({ ...validExpense, date }),
    ).toThrow('Choose a valid date.');
  });
});

describe('calculateTotalCents', () => {
  it('returns zero for an empty expense list', () => {
    expect(calculateTotalCents([])).toBe(0);
  });

  it('returns the amount of a single expense', () => {
    expect(
      calculateTotalCents([{ amountCents: 1250 }]),
    ).toBe(1250);
  });

  it('sums cents without floating-point rounding errors', () => {
    expect(
      calculateTotalCents([
        { amountCents: 10 },
        { amountCents: 20 },
        { amountCents: 999 },
      ]),
    ).toBe(1029);
  });

  it('correctly totals expenses created by the validation helper', () => {
    const expenses = [
      createExpense({
        ...validExpense,
        amount: '10.25',
      }),
      createExpense({
        ...validExpense,
        amount: '3.50',
      }),
      createExpense({
        ...validExpense,
        amount: '0.25',
      }),
    ];

    expect(calculateTotalCents(expenses)).toBe(1400);
  });
});
