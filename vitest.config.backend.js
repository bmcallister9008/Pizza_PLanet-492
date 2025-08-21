// vitest.config.backend.js
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',                           // no JSDOM needed for backend
    include: ['backend/tests/**/*.test.{js,ts}'],  // target only backend test folder
    globals: true,
    setupFiles: ['backend/tests/setup.js'],        // ensures in-memory Mongo runs
    coverage: {
      provider: 'c8',
      reporter: ['text', 'lcov'],
      reportsDirectory: 'coverage/backend',
    },
    pool: 'threads',                               // fine for speed, remove if flaky
  },
})
