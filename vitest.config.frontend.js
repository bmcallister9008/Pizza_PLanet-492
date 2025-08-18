// vitest.config.frontend.js
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['frontend/**/*.test.{js,jsx,ts,tsx}'],
    setupFiles: ['frontend/tests/setupTests.js'],
    coverage: {
      reporter: ['text', 'lcov'],
      reportsDirectory: 'coverage/frontend',
    },
    // Helps transform JSX without the Vite React plugin
    // (works fine for most projects)
  },
  esbuild: {
    jsx: 'automatic',
  },
});
