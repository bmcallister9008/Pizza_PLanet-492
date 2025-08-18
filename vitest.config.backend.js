// vitest.config.backend.js
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['backend/**/*.test.{js,ts}'],
    globals: true,
    coverage: {
      reporter: ['text', 'lcov'],
      reportsDirectory: 'coverage/backend',
    },
    pool: 'threads',
  },
});
