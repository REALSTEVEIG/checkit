import { pathsToModuleNameMapper } from 'ts-jest';
import * as tsconfig from './tsconfig.json';

export default {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: './src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  moduleNameMapper: tsconfig.compilerOptions.paths
    ? pathsToModuleNameMapper(tsconfig.compilerOptions.paths, {
        prefix: '<rootDir>/../',
      })
    : undefined,
};
