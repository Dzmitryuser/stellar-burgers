module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
    moduleNameMapping: {
      '^@components/(.*)$': '<rootDir>/src/components/$1',
      '^@pages/(.*)$': '<rootDir>/src/pages/$1',
      '^@ui/(.*)$': '<rootDir>/src/components/ui/$1',
      '^@ui-pages/(.*)$': '<rootDir>/src/components/ui-pages/$1',
      '^@utils-types$': '<rootDir>/src/utils/types',
      '^@api$': '<rootDir>/src/utils/burger-api',
      '^@services/(.*)$': '<rootDir>/src/services/$1'
    },
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest'
    }
  };
