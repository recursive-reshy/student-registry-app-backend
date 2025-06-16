export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: [ './src/tests' ],
  transform: { '^.+\\.tsx?$': 'ts-jest' },
  testRegex: '((\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  // setupFilesAfterEnv: [ '<rootDir>/tests/setup.ts' ]
}