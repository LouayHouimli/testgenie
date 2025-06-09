// testgenie.config.js
// Complete configuration example with all supported AI providers

export default {
  // Test framework to use
  framework: "jest", // "jest" | "vitest" | "mocha"

  // Test style preference
  style: "bdd", // "bdd" | "tdd" | "minimal" | "verbose"

  // Directory for generated tests
  testDir: "__tests__",

  // AI provider configuration
  ai: {
    // Choose your AI provider:

    // 1. TESTGENIE API (Recommended - Free tier available)
    provider: "testgenie-api",
    // No API key required for basic usage

    // 2. OPENAI (GPT models)
    // provider: "openai",
    // Set OPENAI_API_KEY environment variable
    // model: "gpt-4", // "gpt-4", "gpt-4-turbo", "gpt-4o", "gpt-4o-mini", "gpt-3.5-turbo"

    // 3. GOOGLE GEMINI
    // provider: "gemini",
    // Set GOOGLE_GENERATIVE_AI_API_KEY environment variable
    // model: "gemini-1.5-flash", // "gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro", "gemini-pro-vision"

    // 4. ANTHROPIC CLAUDE
    // provider: "claude",
    // Set ANTHROPIC_API_KEY environment variable
    // model: "claude-3-haiku-20240307", // "claude-3-opus-20240229", "claude-3-sonnet-20240229", "claude-3-haiku-20240307", "claude-3-5-sonnet-20240620"

    // Common AI settings
    model: "auto", // Uses recommended model for the provider
    maxTokens: 4000,
    temperature: 0.7, // 0.0 = deterministic, 1.0 = creative
  },

  // Coverage settings
  coverage: {
    threshold: 80, // Minimum coverage percentage
    exclude: [
      "**/*.config.js",
      "**/migrations/**",
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
    ],
  },

  // File patterns for test discovery and generation
  patterns: {
    // Test file naming patterns
    unitTests: "**/*.test.{js,ts,jsx,tsx}",
    integrationTests: "**/*.integration.{js,ts,jsx,tsx}",
    e2eTests: "**/*.e2e.{js,ts,jsx,tsx}",

    // Source files to include for test generation
    include: [
      "src/**/*.{js,ts,jsx,tsx}",
      "lib/**/*.{js,ts,jsx,tsx}",
      "components/**/*.{js,ts,jsx,tsx}",
      "pages/**/*.{js,ts,jsx,tsx}",
      "utils/**/*.{js,ts,jsx,tsx}",
    ],

    // Files to exclude from test generation
    exclude: [
      "**/*.test.*",
      "**/*.spec.*",
      "**/*.d.ts",
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/.next/**",
      "**/coverage/**",
    ],
  },

  // Output configuration
  output: {
    verbose: true, // Show detailed output
    colors: true, // Use colors in output
    emojis: true, // Use emojis in output
  },

  // Git integration
  git: {
    autoCommit: false, // Automatically commit generated tests
    commitMessage: "test: add generated tests via testgenie", // Commit message template
  },
};

/*
🤖 AI Provider Options:

1. testgenie-api (Recommended)
   - ✅ No API key required
   - ✅ Optimized for test generation
   - ✅ Best performance and cost
   - ✅ Multiple models available
   
2. openai
   - Requires OPENAI_API_KEY
   - Models: gpt-4, gpt-4-turbo, gpt-3.5-turbo
   - High quality but costs apply
   
3. gemini
   - Requires GOOGLE_GENERATIVE_AI_API_KEY
   - Models: gemini-pro, gemini-pro-vision
   - Good performance, competitive pricing
   
4. claude
   - Requires ANTHROPIC_API_KEY
   - Models: claude-3-opus, claude-3-sonnet, claude-3-haiku
   - Excellent code understanding
   
5. local-ollama
   - No API key required
   - Run models locally with Ollama
   - Models: codellama, llama2, mistral, deepseek-coder
   - Complete privacy, no network required
   
6. local-llamacpp
   - No API key required
   - Run models with llama.cpp server
   - Complete privacy, no network required

💡 Pro Tip: Start with testgenie-api for the best experience!
*/
