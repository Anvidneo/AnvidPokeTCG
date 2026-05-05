import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src'],
    testMatch: ['**/__tests__/**/*.test.ts'],
    collectCoverage: true,
    coverageDirectory: 'coverage',
    collectCoverageFrom: [
        'src/**/*.ts',
        '!src/functions/**',
        '!src/repositories/**',
        '!src/**/*.d.ts',
    ],
    coverageThreshold: {
        global: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
        },
    },
    coverageReporters: ['text', 'lcov', 'clover'],
};

export default config;