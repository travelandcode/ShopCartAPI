module.exports = {
    // A list of paths to directories that Jest should use to search for test files.
    testMatch: ["<rootDir>/src/__tests__/**/*.test.ts"],
    
    // The test environment that will be used for testing.
    testEnvironment: "node",
  
    // Transform files with ts-jest for TypeScript support.
    transform: {
      "^.+\\.(ts|tsx)$": "ts-jest",
    },
  
    // Module file extensions.
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  };