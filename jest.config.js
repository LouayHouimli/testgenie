export default {
  preset: 'ts-jest/presets/default-esm',
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  testEnvironment: 'jsdom',
  testMatch: ['**/__tests__/**/*.(test|spec).(js|ts|tsx|jsx)'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      useESM: true,
      isolatedModules: true,
    }],
    '^.+\\.jsx?$': ['babel-jest', { presets: [['@babel/preset-env', { targets: { node: 'current' } }], '@babel/preset-react'] }],
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx,js,jsx}',
    '!src/**/*.d.ts',
    '!src/**/*.test.{ts,tsx,js,jsx}',
    '!src/**/*.spec.{ts,tsx,js,jsx}',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  testTimeout: 30000,
  verbose: false,
  bail: false,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
};