import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it } from 'vitest';
import App from '../src/App.jsx';

it('shows the initial empty state and zero total', () => {
  const markup = renderToStaticMarkup(<App />);

  expect(markup).toContain('Pocket Ledger');
  expect(markup).toContain('$0.00');
  expect(markup).toContain('No expenses yet.');
});
