import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BookOpen,
  Terminal,
  Settings,
  Zap,
  Code,
  CheckCircle,
  Copy,
  ExternalLink,
  Bot,
  ArrowRight,
  GitBranch,
  Play,
  Database,
  Search,
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/docs")({
  component: DocsComponent,
});

function DocsComponent() {
  const [activeSection, setActiveSection] = useState("quick-start");
  const [copiedCode, setCopiedCode] = useState("");

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(""), 2000);
  };

  const sections = [
    {
      id: "quick-start",
      title: "Quick Start",
      icon: <Zap className="w-4 h-4" />,
    },
    {
      id: "installation",
      title: "Installation",
      icon: <Terminal className="w-4 h-4" />,
    },
    { id: "commands", title: "Commands", icon: <Code className="w-4 h-4" /> },
    {
      id: "configuration",
      title: "Configuration",
      icon: <Settings className="w-4 h-4" />,
    },
    {
      id: "examples",
      title: "Examples",
      icon: <BookOpen className="w-4 h-4" />,
    },
    {
      id: "ai-providers",
      title: "AI Providers",
      icon: <Bot className="w-4 h-4" />,
    },
    { id: "faq", title: "FAQ", icon: <Search className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 to-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-3 hover:opacity-90 transition-opacity"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-900/20">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent">
              TestGenie AI
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="hidden md:block text-zinc-400 hover:text-white transition-colors"
            >
              Home
            </Link>
            <a
              href="https://github.com/testgenie-ai/testgenie"
              className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
              <span className="hidden md:inline">GitHub</span>
            </a>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Documentation title banner */}
        <div className="mb-12 text-center md:text-left">
          <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">
            Documentation
          </h1>
          <p className="text-zinc-400 mt-4 max-w-3xl md:text-lg">
            Complete reference guide for TestGenie AI - the AI-powered test
            generator for JavaScript and TypeScript projects.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <nav className="md:w-64 sticky top-24 h-fit mb-8 md:mb-0">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 md:block flex flex-wrap gap-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-left transition-all duration-200 ${
                    activeSection === section.id
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800/70"
                  } md:w-full w-auto`}
                >
                  <div
                    className={`${
                      activeSection === section.id
                        ? "bg-blue-500/20"
                        : "bg-zinc-800"
                    } w-6 h-6 rounded-md flex items-center justify-center transition-colors`}
                  >
                    {section.icon}
                  </div>
                  <span className="font-medium">{section.title}</span>
                </button>
              ))}
            </div>

            {/* Additional sidebar elements */}
            <div className="hidden md:block mt-6 bg-blue-900/20 border border-blue-800/30 rounded-xl p-4">
              <h3 className="text-blue-300 font-medium mb-2 flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4" />
                  <path d="M12 8h.01" />
                </svg>
                Need Help?
              </h3>
              <p className="text-zinc-400 text-sm mb-3">
                Can't find what you're looking for or have questions?
              </p>
              <a
                href="mailto:support@testgenie.ai"
                className="text-blue-400 text-sm flex items-center gap-1 hover:text-blue-300 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                Contact Support
              </a>
            </div>
          </nav>

          {/* Main Content */}
          <main className="flex-1 max-w-4xl">
            {activeSection === "quick-start" && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-4xl font-bold mb-4">Quick Start</h1>
                  <p className="text-zinc-400 text-lg">
                    Get up and running with TestGenie AI in minutes.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <Terminal className="w-5 h-5 text-green-400" />
                      1. Install TestGenie
                    </h3>
                    <div className="bg-black rounded-lg p-4 font-mono text-sm relative">
                      <button
                        onClick={() =>
                          copyToClipboard(
                            "npm install -g testgenie-ai",
                            "install"
                          )
                        }
                        className="absolute top-2 right-2 p-2 text-zinc-400 hover:text-white transition-colors"
                      >
                        {copiedCode === "install" ? (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                      <span className="text-zinc-500">$</span>{" "}
                      <span className="text-green-400">
                        npm install -g testgenie-ai
                      </span>
                    </div>
                  </div>

                  <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <Settings className="w-5 h-5 text-blue-400" />
                      2. Initialize Configuration
                    </h3>
                    <div className="bg-black rounded-lg p-4 font-mono text-sm relative mb-4">
                      <button
                        onClick={() =>
                          copyToClipboard("testgenie init", "init")
                        }
                        className="absolute top-2 right-2 p-2 text-zinc-400 hover:text-white transition-colors"
                      >
                        {copiedCode === "init" ? (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                      <span className="text-zinc-500">$</span>{" "}
                      <span className="text-blue-400">testgenie init</span>
                    </div>
                    <p className="text-zinc-400">
                      This interactive setup configures your test framework, AI
                      provider, and preferences.
                    </p>
                  </div>

                  <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <Code className="w-5 h-5 text-purple-400" />
                      3. Generate Tests
                    </h3>
                    <div className="space-y-2">
                      <div className="bg-black rounded-lg p-4 font-mono text-sm relative">
                        <button
                          onClick={() =>
                            copyToClipboard(
                              "testgenie gen src/utils/helper.ts",
                              "gen1"
                            )
                          }
                          className="absolute top-2 right-2 p-2 text-zinc-400 hover:text-white transition-colors"
                        >
                          {copiedCode === "gen1" ? (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                        <span className="text-zinc-500">$</span>{" "}
                        <span className="text-yellow-400">
                          testgenie gen src/utils/helper.ts
                        </span>
                      </div>
                      <div className="bg-black rounded-lg p-4 font-mono text-sm relative">
                        <button
                          onClick={() =>
                            copyToClipboard("testgenie gen --diff", "gen2")
                          }
                          className="absolute top-2 right-2 p-2 text-zinc-400 hover:text-white transition-colors"
                        >
                          {copiedCode === "gen2" ? (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                        <span className="text-zinc-500">$</span>{" "}
                        <span className="text-yellow-400">
                          testgenie gen --diff
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <Play className="w-5 h-5 text-green-400" />
                      4. Run Tests
                    </h3>
                    <div className="bg-black rounded-lg p-4 font-mono text-sm relative">
                      <button
                        onClick={() =>
                          copyToClipboard("testgenie test --coverage", "test")
                        }
                        className="absolute top-2 right-2 p-2 text-zinc-400 hover:text-white transition-colors"
                      >
                        {copiedCode === "test" ? (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                      <span className="text-zinc-500">$</span>{" "}
                      <span className="text-green-400">
                        testgenie test --coverage
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "installation" && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-4xl font-bold mb-4">Installation</h1>
                  <p className="text-zinc-400 text-lg">
                    Multiple ways to install TestGenie AI.
                  </p>
                </div>

                <div className="grid gap-6">
                  <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-3">npm</h3>
                    <div className="bg-black rounded-lg p-4 font-mono text-sm">
                      npm install -g testgenie-ai
                    </div>
                  </div>

                  <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-3">yarn</h3>
                    <div className="bg-black rounded-lg p-4 font-mono text-sm">
                      yarn global add testgenie-ai
                    </div>
                  </div>

                  <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-3">pnpm</h3>
                    <div className="bg-black rounded-lg p-4 font-mono text-sm">
                      pnpm add -g testgenie-ai
                    </div>
                  </div>

                  <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-3">bun</h3>
                    <div className="bg-black rounded-lg p-4 font-mono text-sm">
                      bun add -g testgenie-ai
                    </div>
                  </div>
                </div>

                <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-3 text-blue-400">
                    System Requirements
                  </h3>
                  <ul className="space-y-2 text-zinc-300">
                    <li>• Node.js 16+ (LTS recommended)</li>
                    <li>• Git (optional, for diff-based generation)</li>
                    <li>• Jest (auto-installed when needed)</li>
                  </ul>
                </div>
              </div>
            )}

            {activeSection === "commands" && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-4xl font-bold mb-4">Commands</h1>
                  <p className="text-zinc-400 text-lg">
                    Complete reference for all TestGenie commands.
                  </p>
                </div>

                <div className="space-y-8">
                  <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-6">
                    <h3 className="text-2xl font-semibold mb-4">
                      testgenie init
                    </h3>
                    <p className="text-zinc-400 mb-4">
                      Initialize or update configuration file.
                    </p>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-zinc-200 mb-2">
                          Options:
                        </h4>
                        <div className="bg-black rounded-lg p-3 font-mono text-sm">
                          --force, -f Overwrite existing configuration
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-zinc-200 mb-2">
                          Example:
                        </h4>
                        <div className="bg-black rounded-lg p-3 font-mono text-sm">
                          testgenie init --force
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-6">
                    <h3 className="text-2xl font-semibold mb-4">
                      testgenie gen [file]
                    </h3>
                    <p className="text-zinc-400 mb-4">
                      Generate comprehensive test files.
                    </p>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-zinc-200 mb-2">
                          Options:
                        </h4>
                        <div className="bg-black rounded-lg p-3 font-mono text-sm space-y-1">
                          <div>
                            --diff, -d Generate tests for uncommitted git
                            changes
                          </div>
                          <div>
                            --since, -s &lt;commit&gt; Generate tests for
                            changes since commit
                          </div>
                          <div>
                            --style &lt;style&gt; Override test style (bdd, tdd,
                            minimal, verbose)
                          </div>
                          <div>
                            --output, -o &lt;dir&gt; Override output directory
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-zinc-200 mb-2">
                          Examples:
                        </h4>
                        <div className="bg-black rounded-lg p-3 font-mono text-sm space-y-1">
                          <div className="text-zinc-500">
                            # Generate tests for specific file
                          </div>
                          <div>testgenie gen src/components/Button.tsx</div>
                          <div className="text-zinc-500 mt-2">
                            # Generate tests for all changed files
                          </div>
                          <div>testgenie gen --diff</div>
                          <div className="text-zinc-500 mt-2">
                            # Use specific style
                          </div>
                          <div>
                            testgenie gen src/utils/math.js --style minimal
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-6">
                    <h3 className="text-2xl font-semibold mb-4">
                      testgenie test [pattern]
                    </h3>
                    <p className="text-zinc-400 mb-4">
                      Execute tests with automatic setup.
                    </p>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-zinc-200 mb-2">
                          Options:
                        </h4>
                        <div className="bg-black rounded-lg p-3 font-mono text-sm space-y-1">
                          <div>
                            --watch, -w Watch mode for continuous testing
                          </div>
                          <div>--coverage, -c Generate coverage reports</div>
                          <div>--reporter, -r Test reporter format</div>
                          <div>--filter, -f Filter tests by name pattern</div>
                          <div>--parallel, -p Run tests in parallel</div>
                          <div>--silent, -s Suppress test output</div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-zinc-200 mb-2">
                          Examples:
                        </h4>
                        <div className="bg-black rounded-lg p-3 font-mono text-sm space-y-1">
                          <div>testgenie test --coverage</div>
                          <div>testgenie test --watch --reporter=verbose</div>
                          <div>testgenie test --filter="Calculator"</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-6">
                    <h3 className="text-2xl font-semibold mb-4">
                      testgenie audit
                    </h3>
                    <p className="text-zinc-400 mb-4">
                      Comprehensive test coverage audit.
                    </p>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-zinc-200 mb-2">
                          Options:
                        </h4>
                        <div className="bg-black rounded-lg p-3 font-mono text-sm space-y-1">
                          <div>
                            --fix Auto-generate tests for uncovered files
                          </div>
                          <div>
                            --format, -f Report format (text, json, html)
                          </div>
                          <div>--deep Enable deep analysis</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "configuration" && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-4xl font-bold mb-4">Configuration</h1>
                  <p className="text-zinc-400 text-lg">
                    Customize TestGenie with testgenie.config.js
                  </p>
                </div>

                <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-4">
                    Default Configuration
                  </h3>
                  <div className="bg-black rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm text-zinc-300">
                      {`export default {
  // Test framework (Jest only for now)
  framework: "jest",

  // Test generation style
  style: "bdd", // "bdd" | "tdd" | "minimal" | "verbose"

  // Test directory
  testDir: "__tests__",

  // AI provider configuration
  ai: {
    provider: "testgenie-api", // "testgenie-api" | "openai" | "gemini" | "claude"
    model: "auto", // or specific model name
  },

  // File patterns to include
  include: ["src/**/*.{js,ts,jsx,tsx}", "lib/**/*.{js,ts,jsx,tsx}"],

  // File patterns to exclude
  exclude: [
    "**/*.test.{js,ts,jsx,tsx}",
    "**/*.spec.{js,ts,jsx,tsx}",
    "**/node_modules/**",
  ],

  // Coverage settings
  coverage: {
    threshold: 80, // minimum coverage percentage
    includeUntested: true,
  },

  // Git integration
  git: {
    autoCommit: false,
    commitMessage: "test: add generated tests",
  },

  // Output preferences
  output: {
    emojis: true,
    verbose: false,
  },
};`}
                    </pre>
                  </div>
                </div>

                <div className="grid gap-6">
                  <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-3">Test Styles</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span className="font-mono">bdd</span>
                        <span className="text-zinc-400">
                          - Behavior Driven Development (describe/it)
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="font-mono">tdd</span>
                        <span className="text-zinc-400">
                          - Test Driven Development (suite/test)
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                        <span className="font-mono">minimal</span>
                        <span className="text-zinc-400">
                          - Concise, straightforward tests
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                        <span className="font-mono">verbose</span>
                        <span className="text-zinc-400">
                          - Detailed with extensive comments
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "ai-providers" && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-4xl font-bold mb-4">AI Providers</h1>
                  <p className="text-zinc-400 text-lg">
                    Configure different AI providers for test generation.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-700 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Bot className="w-6 h-6 text-blue-400" />
                      <h3 className="text-2xl font-semibold">
                        TestGenie API (Recommended)
                      </h3>
                    </div>
                    <ul className="space-y-2 text-zinc-300 mb-4">
                      <li>• No API key required</li>
                      <li>• Optimized for test generation</li>
                      <li>• Best performance and quality</li>
                    </ul>
                    <div className="bg-black rounded-lg p-3 font-mono text-sm">
                      provider: "testgenie-api"
                    </div>
                  </div>

                  <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-3">
                      OpenAI (GPT Models)
                    </h3>
                    <p className="text-zinc-400 mb-4">
                      Models: GPT-4o, GPT-4o-mini, GPT-4-turbo
                    </p>
                    <div className="bg-black rounded-lg p-3 font-mono text-sm">
                      export OPENAI_API_KEY="your-api-key"
                    </div>
                  </div>

                  <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-3">
                      Google Gemini
                    </h3>
                    <p className="text-zinc-400 mb-4">
                      Models: Gemini-1.5-Pro, Gemini-1.5-Flash
                    </p>
                    <div className="bg-black rounded-lg p-3 font-mono text-sm">
                      export GOOGLE_GENERATIVE_AI_API_KEY="your-api-key"
                    </div>
                  </div>

                  <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-3">
                      Anthropic Claude
                    </h3>
                    <p className="text-zinc-400 mb-4">
                      Models: Claude-3.5-Sonnet, Claude-3-Haiku
                    </p>
                    <div className="bg-black rounded-lg p-3 font-mono text-sm">
                      export ANTHROPIC_API_KEY="your-api-key"
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "examples" && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-4xl font-bold mb-4">Examples</h1>
                  <p className="text-zinc-400 text-lg">
                    Real-world examples of TestGenie in action.
                  </p>
                </div>

                <div className="space-y-8">
                  <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-4">
                      Basic Function Testing
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold text-zinc-400 mb-2">
                          Source Code:
                        </h4>
                        <div className="bg-black rounded-lg p-4 overflow-x-auto">
                          <pre className="text-sm text-zinc-300">
                            {`// src/utils/math.js
export function add(a, b) {
  return a + b;
}

export function multiply(a, b) {
  return a * b;
}`}
                          </pre>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-zinc-400 mb-2">
                          Generated Test:
                        </h4>
                        <div className="bg-black rounded-lg p-4 overflow-x-auto">
                          <pre className="text-sm text-zinc-300">
                            {`// __tests__/src/utils/math.test.js
import { describe, it, expect } from "@jest/globals";
import { add, multiply } from "../../../src/utils/math.js";

describe("add", () => {
  it("should return correct sum for positive numbers", () => {
    expect(add(2, 3)).toBe(5);
  });

  it("should handle negative numbers", () => {
    expect(add(-1, 1)).toBe(0);
  });

  it("should handle zero values", () => {
    expect(add(0, 5)).toBe(5);
  });
});

describe("multiply", () => {
  it("should return correct product", () => {
    expect(multiply(3, 4)).toBe(12);
  });

  it("should handle zero multiplication", () => {
    expect(multiply(5, 0)).toBe(0);
  });
});`}
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-4">
                      React Component Testing
                    </h3>

                    <div>
                      <h4 className="text-sm font-semibold text-zinc-400 mb-2">
                        Command:
                      </h4>
                      <div className="bg-black rounded-lg p-4 font-mono text-sm mb-4">
                        testgenie gen src/components/UserForm.tsx
                      </div>

                      <h4 className="text-sm font-semibold text-zinc-400 mb-2">
                        Generated Test:
                      </h4>
                      <div className="bg-black rounded-lg p-4 overflow-x-auto">
                        <pre className="text-sm text-zinc-300">
                          {`import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { UserForm } from "../../../src/components/UserForm";

beforeEach(() => {
  jest.clearAllMocks();
  window.alert = jest.fn();
});

describe("UserForm", () => {
  it("should submit form with valid data", () => {
    const onSubmit = jest.fn();
    render(<UserForm onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText("Name:"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText("Email:"), {
      target: { value: "john@example.com" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /Submit/i }));

    expect(onSubmit).toHaveBeenCalledWith({
      name: "John Doe",
      email: "john@example.com",
      age: "",
    });
  });
});`}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "faq" && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-4xl font-bold mb-4">FAQ</h1>
                  <p className="text-zinc-400 text-lg">
                    Frequently asked questions about TestGenie AI.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-3">
                      Why are my tests not being generated?
                    </h3>
                    <div className="text-zinc-400 space-y-2">
                      <p>Check these common issues:</p>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Verify the file path exists and is accessible</li>
                        <li>
                          Check your exclude patterns in testgenie.config.js
                        </li>
                        <li>
                          Ensure the file has a supported extension (.js, .ts,
                          .jsx, .tsx)
                        </li>
                        <li>
                          Verify your AI provider API keys are set correctly
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-3">
                      How do I run tests after generating them?
                    </h3>
                    <div className="text-zinc-400 space-y-3">
                      <p>
                        TestGenie includes a built-in test runner with automatic
                        setup:
                      </p>
                      <div className="bg-black rounded-lg p-3 font-mono text-sm space-y-1">
                        <div>testgenie test # Basic test execution</div>
                        <div>
                          testgenie test --coverage # With coverage reports
                        </div>
                        <div>
                          testgenie test --watch # Watch mode for development
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-3">
                      Can I use it with Mocha or Vitest?
                    </h3>
                    <div className="text-zinc-400">
                      <p className="mb-2">
                        Currently, only Jest is supported. Framework support
                        roadmap:
                      </p>
                      <ul className="space-y-1">
                        <li>
                          • <span className="text-green-400">Jest</span> - ✅
                          Full support
                        </li>
                        <li>
                          • <span className="text-yellow-400">Mocha</span> - 🚧
                          Coming Q3 2025
                        </li>
                        <li>
                          • <span className="text-blue-400">Vitest</span> - 🚧
                          Coming Q2 2025
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-3">
                      How accurate are the generated tests?
                    </h3>
                    <div className="text-zinc-400 space-y-2">
                      <p>
                        TestGenie uses advanced AI models specifically trained
                        for test generation with:
                      </p>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Code structure and dependency analysis</li>
                        <li>
                          React component validation and form behavior
                          understanding
                        </li>
                        <li>Async function execution and Promise handling</li>
                        <li>Comprehensive edge cases and error handling</li>
                        <li>Production-ready test scenarios</li>
                      </ul>
                      <p className="mt-3">
                        While tests are comprehensive, always review them before
                        committing to ensure they meet your specific
                        requirements.
                      </p>
                    </div>
                  </div>

                  <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-3 text-blue-400">
                      Need More Help?
                    </h3>
                    <div className="text-zinc-300 space-y-2">
                      <p>• 📧 Email: support@testgenie.ai</p>
                      <p>
                        • 🐛 Issues:{" "}
                        <a
                          href="https://github.com/testgenie-ai/testgenie/issues"
                          className="text-blue-400 hover:underline"
                        >
                          GitHub Issues
                        </a>
                      </p>
                      <p>
                        • 💬 Discussions:{" "}
                        <a
                          href="https://github.com/testgenie-ai/testgenie/discussions"
                          className="text-blue-400 hover:underline"
                        >
                          GitHub Discussions
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
