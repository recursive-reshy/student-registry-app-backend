const  config = {
  preset: 'ts-jest/presets/default-esm',
  extensionsToTreatAsEsm: [ '.ts' ],
  globals: {
    'ts-jest': {
      useESM: true
    }
  },
  testEnvironment: 'node',
  roots: [ '<rootDir>/src', '<rootDir>/tests' ],
  testMatch: [ '**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts' ],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/server.ts',
    '!src/**/*.d.ts'
  ],
  setupFilesAfterEnv: [ '<rootDir>/tests/setup.ts' ]
}

export default config