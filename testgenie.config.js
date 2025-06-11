// testgenie.config.js
export default {
  // Test framework to use
  framework: "jest",
  
  // Test style preference
  style: "bdd",
  
  // Directory for generated tests
  testDir: "__tests__",
  
  // AI provider configuration
  ai: {
    provider: "gemini",
    model: "gemini-1.5-flash",
    maxTokens: 4000,
    temperature: 0.7,
  },
  
  // Coverage settings
  coverage: {
    threshold: 80,
    exclude: [
      "**/*.config.js",
      "**/migrations/**",
      "**/node_modules/**"
    ]
  },
  
  // File patterns
  patterns: {
    unitTests: "**/*.test.{js,ts}",
    integrationTests: "**/*.integration.{js,ts}",
    e2eTests: "**/*.e2e.{js,ts}",
    include: [
      "src/**/*.{js,ts}",
      "lib/**/*.{js,ts}"
],
    exclude: [
      "**/*.test.*",
      "**/*.spec.*",
      "**/node_modules/**"
    ]
  },
  
  // Output preferences
  output: {
    verbose: false,
    colors: true,
    emojis: true
  },
  
  // Git integration
  git: {
    autoCommit: false,
    commitMessage: "feat: add generated tests"
  }
};
