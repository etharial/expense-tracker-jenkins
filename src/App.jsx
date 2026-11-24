import React from 'react';
import { useState } from 'react';
import {
  calculateTotalCents,
  categories,
  createExpense,
  filterExpensesByCategory,
} from './expenses.js';
import './styles.css';

function todayAsLocalDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatCurrency(amountCents) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amountCents / 100);
}

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [date, setDate] = useState(todayAsLocalDate);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const totalCents = calculateTotalCents(expenses);
  const visibleExpenses = filterExpensesByCategory(expenses, selectedCategory);

  function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const expense = createExpense({
        description: formData.get('description'),
        amount: formData.get('amount'),
        category: formData.get('category'),
        date: formData.get('date'),
      });
      setExpenses((currentExpenses) => [expense, ...currentExpenses]);
      setError('');
      form.reset();
      setDate(todayAsLocalDate());
    } catch (submitError) {
      setError(submitError.message);
    }
  }

  return (
    <main className="page-shell">
      <header className="page-header">
        <div>
          <p className="eyebrow">PERSONAL FINANCE</p>
          <h1>Pocket Ledger</h1>
          <p className="intro">A simple place to keep today&apos;s spending in view.</p>
        </div>
        <div className="total-card" aria-live="polite">
          <span>Total tracked</span>
          <strong>{formatCurrency(totalCents)}</strong>
          <span>{expenses.length} {expenses.length === 1 ? 'expense' : 'expenses'}</span>
        </div>
      </header>

      <section className="content-grid" aria-label="Expense tracker">
        <form className="expense-form" onSubmit={handleSubmit}>
          <h2>Add an expense</h2>
          <label>
            Description
            <input name="description" placeholder="e.g. Lunch with a friend" required />
          </label>
          <div className="form-row">
            <label>
              Amount (USD)
              <input
                name="amount"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="0.00"
                required
              />
            </label>
            <label>
              Category
              <select name="category" defaultValue="Food">
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </label>
          </div>
          <label>
            Date
            <input
              name="date"
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              required
            />
          </label>
          {error && <p className="error-message" role="alert">{error}</p>}
          <button type="submit">Add expense</button>
        </form>

        <section className="expense-list" aria-labelledby="expense-list-title">
          <div className="list-heading">
            <div>
              <p className="eyebrow">YOUR ACTIVITY</p>
              <h2 id="expense-list-title">Recent expenses</h2>
            </div>
            <label className="filter-control">
              Filter by category
              <select
                aria-label="Filter expenses by category"
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
              >
                <option value="All">All categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </label>
          </div>
          {expenses.length === 0 ? (
            <p className="empty-state">No expenses yet. Add one to get started.</p>
          ) : visibleExpenses.length === 0 ? (
            <p className="empty-state">No expenses in this category.</p>
          ) : (
            <ul>
              {visibleExpenses.map((expense) => (
                <li className="expense-item" key={expense.id}>
                  <div className="expense-details">
                    <strong>{expense.description}</strong>
                    <span>{expense.category} · {expense.date}</span>
                  </div>
                  <strong className="expense-amount">{formatCurrency(expense.amountCents)}</strong>
                </li>
              ))}
            </ul>
          )}
        </section>
      </section>
    </main>
  );
}
