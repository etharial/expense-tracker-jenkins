// @vitest-environment jsdom

import React from 'react';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  afterEach,
  describe,
  expect,
  it,
} from 'vitest';

import App from '../src/App.jsx';

afterEach(() => {
  cleanup();
});

function fillExpense({
  description = 'Coffee',
  amount = '3.50',
  category = 'Food',
  date = '2026-11-24',
} = {}) {
  fireEvent.change(screen.getByLabelText('Description'), {
    target: { value: description },
  });

  fireEvent.change(screen.getByLabelText('Amount (USD)'), {
    target: { value: amount },
  });

  fireEvent.change(screen.getByLabelText('Category'), {
    target: { value: category },
  });

  fireEvent.change(screen.getByLabelText('Date'), {
    target: { value: date },
  });
}

function submitExpense() {
  fireEvent.click(
    screen.getByRole('button', { name: 'Add expense' }),
  );
}

function totalCard() {
  return within(
    screen.getByText('Total tracked').parentElement,
  );
}

describe('Pocket Ledger initial state', () => {
  it('renders the original empty state and zero total', () => {
    const markup = renderToStaticMarkup(<App />);

    expect(markup).toContain('Pocket Ledger');
    expect(markup).toContain('$0.00');
    expect(markup).toContain('No expenses yet.');
  });

  it('renders the expense form with its default values', () => {
    render(<App />);

    expect(
      screen.getByRole('heading', { name: 'Pocket Ledger' }),
    ).toBeTruthy();

    expect(
      screen.getByLabelText('Description').value,
    ).toBe('');

    expect(
      screen.getByLabelText('Amount (USD)').value,
    ).toBe('');

    expect(
      screen.getByLabelText('Category').value,
    ).toBe('Food');

    expect(
      screen.getByLabelText('Date').value,
    ).toMatch(/^\d{4}-\d{2}-\d{2}$/);

    expect(
      totalCard().getByText('0 expenses'),
    ).toBeTruthy();
  });

  it('provides all supported expense categories', () => {
    render(<App />);

    const options = within(
      screen.getByLabelText('Category'),
    ).getAllByRole('option');

    expect(options.map((option) => option.value)).toEqual([
      'Food',
      'Transport',
      'Housing',
      'Utilities',
      'Other',
    ]);
  });
});

describe('Pocket Ledger expense submission', () => {
  it('adds a valid expense and updates the displayed total', () => {
    render(<App />);

    fillExpense();
    submitExpense();

    const item = within(screen.getByRole('listitem'));

    expect(item.getByText('Coffee')).toBeTruthy();
    expect(item.getByText('$3.50')).toBeTruthy();

    expect(
      item.getByText(/Food.*2026-11-24/),
    ).toBeTruthy();

    expect(
      totalCard().getByText('$3.50'),
    ).toBeTruthy();

    expect(
      totalCard().getByText('1 expense'),
    ).toBeTruthy();

    expect(
      screen.queryByText(/No expenses yet/),
    ).toBeNull();
  });

  it('adds multiple expenses and calculates the exact total', () => {
    render(<App />);

    fillExpense({
      description: 'Coffee',
      amount: '3.50',
    });

    submitExpense();

    fillExpense({
      description: 'Bus fare',
      amount: '2.25',
      category: 'Transport',
      date: '2026-11-25',
    });

    submitExpense();

    expect(screen.getAllByRole('listitem')).toHaveLength(2);

    expect(
      totalCard().getByText('$5.75'),
    ).toBeTruthy();

    expect(
      totalCard().getByText('2 expenses'),
    ).toBeTruthy();

    const items = screen.getAllByRole('listitem');

    expect(
      within(items[0]).getByText('Bus fare'),
    ).toBeTruthy();

    expect(
      within(items[1]).getByText('Coffee'),
    ).toBeTruthy();
  });

  it('stores the selected date and category', () => {
    render(<App />);

    fillExpense({
      description: 'Electricity bill',
      amount: '45.00',
      category: 'Utilities',
      date: '2026-10-15',
    });

    expect(
      screen.getByLabelText('Date').value,
    ).toBe('2026-10-15');

    submitExpense();

    const item = within(screen.getByRole('listitem'));

    expect(
      item.getByText(/Utilities.*2026-10-15/),
    ).toBeTruthy();

    expect(
      item.getByText('$45.00'),
    ).toBeTruthy();
  });

  it('clears the form after a successful submission', () => {
    render(<App />);

    fillExpense({
      description: 'Taxi',
      amount: '10.00',
      category: 'Transport',
      date: '2026-01-01',
    });

    submitExpense();

    expect(
      screen.getByLabelText('Description').value,
    ).toBe('');

    expect(
      screen.getByLabelText('Amount (USD)').value,
    ).toBe('');

    expect(
      screen.getByLabelText('Category').value,
    ).toBe('Food');

    expect(
      screen.queryByRole('alert'),
    ).toBeNull();
  });

  it('totals decimal currency amounts without rounding errors', () => {
    render(<App />);

    fillExpense({
      description: 'First expense',
      amount: '0.10',
    });

    submitExpense();

    fillExpense({
      description: 'Second expense',
      amount: '0.20',
    });

    submitExpense();

    expect(
      totalCard().getByText('$0.30'),
    ).toBeTruthy();
  });
});

describe('Pocket Ledger validation and recovery', () => {
  it('rejects a whitespace-only description', () => {
    render(<App />);

    fillExpense({
      description: '   ',
      amount: '5.00',
    });

    submitExpense();

    expect(
      screen.getByRole('alert').textContent,
    ).toBe('Enter a description.');

    expect(
      screen.queryByRole('listitem'),
    ).toBeNull();

    expect(
      totalCard().getByText('$0.00'),
    ).toBeTruthy();
  });

  it('clears an existing error after a valid submission', () => {
    render(<App />);

    fillExpense({
      description: '   ',
      amount: '5.00',
    });

    submitExpense();

    expect(screen.getByRole('alert')).toBeTruthy();

    fireEvent.change(
      screen.getByLabelText('Description'),
      {
        target: { value: 'Lunch' },
      },
    );

    submitExpense();

    expect(screen.queryByRole('alert')).toBeNull();

    expect(
      within(screen.getByRole('listitem')).getByText('Lunch'),
    ).toBeTruthy();

    expect(
      totalCard().getByText('$5.00'),
    ).toBeTruthy();
  });

  it('preserves previously recorded expenses after invalid input', () => {
    render(<App />);

    fillExpense({
      description: 'Lunch',
      amount: '12.00',
    });

    submitExpense();

    fillExpense({
      description: '   ',
      amount: '8.00',
    });

    submitExpense();

    expect(screen.getByRole('alert')).toBeTruthy();
    expect(screen.getAllByRole('listitem')).toHaveLength(1);

    expect(
      totalCard().getByText('$12.00'),
    ).toBeTruthy();

    expect(
      within(screen.getByRole('listitem')).getByText('Lunch'),
    ).toBeTruthy();
  });
});