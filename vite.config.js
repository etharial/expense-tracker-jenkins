import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    coverage: {
      include: ['src/**/*.js', 'src/**/*.jsx'],
      exclude: ['src/main.jsx'],
    },
  },
});
