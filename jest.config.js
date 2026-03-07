module.exports = {
    preset: "ts-jest",
    globals: {
        'ts-jest': {
            tsconfig: 'tsconfig.jest.json',
        },
    },
    setupFilesAfterEnv: ['@testing-library/jest-dom']
}
