module.exports = {
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/**/*.type.ts',
    '!<rootDir>/src/**/*.interface.ts',
    '!<rootDir>/src/**/*.helper.ts',
    '!<rootDir>/src/**/*.factory.ts',
    '!<rootDir>/src/**/*.app.ts',
    '!<rootDir>/src/**/*.server.ts'
  ],
  coverageDirectory: 'coverage',
  coverageProvider: 'babel',
  moduleNameMapper: {
    '@/(.+)': '<rootDir>/src/$1'
  },
  testMatch: ['**/*.spec.ts'],
  roots: [
    '<rootDir>/src'
  ],
  transform: {
    '\\.ts$': 'ts-jest'
  },
  clearMocks: true
}
