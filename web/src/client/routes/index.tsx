import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Terminal,
  Zap,
  Shield,
  Code,
  GitBranch,
  Download,
  Star,
  ArrowRight,
  CheckCircle,
  Clock,
  Bot,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-900">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Abstract background elements */}
        <div className="absolute inset-0 opacity-30 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-600/20 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600/20 rounded-full filter blur-3xl"></div>
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-zinc-800/70 backdrop-blur-sm border border-zinc-700 rounded-full px-4 py-2 mb-8">
            <Bot className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-zinc-300">
              AI-Powered Test Generation
            </span>
            <div className="w-2 h-2 rounded-full bg-green-400 ml-1 animate-pulse"></div>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-300 bg-clip-text text-transparent mb-6 tracking-tight">
            TestGenie AI
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-zinc-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Generate comprehensive test suites for your JavaScript/TypeScript
            projects in seconds using advanced AI models.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <div className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-700 rounded-lg p-4 font-mono text-left w-full sm:w-auto transform transition-all hover:scale-105 hover:shadow-lg hover:shadow-blue-900/20">
              <span className="text-zinc-500">$</span>{" "}
              <span className="text-green-400">
                npm install -g testgenie-ai
              </span>
            </div>
            <div className="flex items-center gap-3 text-zinc-400">
              <div className="flex items-center justify-center bg-zinc-800/50 rounded-full w-8 h-8">
                <Download className="w-4 h-4 text-blue-400" />
              </div>
              <span className="text-sm font-medium">10,000+ downloads</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/docs"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:shadow-blue-600/25"
            >
              Get Started <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
            <a
              href="https://github.com/testgenie-ai/testgenie"
              className="inline-flex items-center gap-2 bg-zinc-800/80 backdrop-blur-sm hover:bg-zinc-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 border border-zinc-600 hover:border-zinc-500 hover:shadow-lg hover:shadow-zinc-800/25"
            >
              <Star className="w-4 h-4" /> View on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4 bg-zinc-900/50 relative">
        {/* Subtle grid background pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMDIwMjAiIGZpbGwtb3BhY2l0eT0iMC4zIj48cGF0aCBkPSJNMzYgMzRoLTJWMGgydjM0em0tNCAwSDI4VjBoNHYzNHptLTYgMGgtMlYwaDJ2MzR6bS02IDBoLTRWMGg0djM0em0tNiAwaC0yVjBoMnYzNHoiLz48cGF0aCBkPSJNNjAgMzRoLTJWMGgydjM0em0tNCAwSDI4VjBoMjh2MzR6TTM2IDRoLTJWMGgydjR6bS00IDBoLTRWMGg0djR6bS02IDBoLTJWMGgydjR6bS02IDBoLTRWMGg0djR6bS02IDBoLTJWMGgydjR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-5"></div>

        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 text-sm font-medium bg-blue-900/30 text-blue-300 rounded-full mb-4">
              POWERFUL FEATURES
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              Why Choose TestGenie?
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
              Our AI-powered platform offers everything you need to create
              perfect test coverage without the hassle.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Bot className="w-10 h-10 text-blue-400" />,
                title: "AI-Powered Intelligence",
                description:
                  "Smart code analysis that detects patterns, dependencies, and behaviors with multi-provider support (OpenAI, Google Gemini, Anthropic Claude).",
                color: "blue",
              },
              {
                icon: <Zap className="w-10 h-10 text-yellow-400" />,
                title: "Lightning Fast",
                description:
                  "Generate complete test suites in seconds, not hours. Automatic setup and configuration saves you valuable development time.",
                color: "yellow",
              },
              {
                icon: <GitBranch className="w-10 h-10 text-green-400" />,
                title: "Git Integration",
                description:
                  "Generate tests for changed files or specific commits automatically. Perfect for CI/CD workflows and maintaining coverage on new changes.",
                color: "green",
              },
              {
                icon: <Code className="w-10 h-10 text-purple-400" />,
                title: "React Component Intelligence",
                description:
                  "Detects JSX/TSX files and generates proper React Testing Library tests with event handling, prop validation, and state changes.",
                color: "purple",
              },
              {
                icon: <Shield className="w-10 h-10 text-red-400" />,
                title: "Comprehensive Coverage",
                description:
                  "Creates thorough test suites with edge cases, error handling, and boundary conditions. Automatically identifies untested code paths.",
                color: "red",
              },
              {
                icon: <Terminal className="w-10 h-10 text-cyan-400" />,
                title: "Multiple Test Styles",
                description:
                  "Choose from BDD, TDD, minimal, and verbose styles to match your team's preferences and testing philosophy.",
                color: "cyan",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className={`group bg-zinc-800/50 backdrop-blur-sm border border-zinc-700 rounded-xl p-8 hover:bg-zinc-800/70 transition-all duration-300 hover:shadow-lg hover:border-${feature.color}-700/50 relative overflow-hidden`}
              >
                <div
                  className={`w-16 h-16 rounded-lg bg-${feature.color}-900/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-zinc-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Start Demo */}
      <section className="py-24 px-4 relative">
        {/* Background elements */}
        <div className="absolute inset-0 opacity-30 overflow-hidden">
          <div className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 w-full h-1/3 bg-gradient-to-r from-blue-900/10 via-purple-900/10 to-blue-900/10"></div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 text-sm font-medium bg-green-900/30 text-green-300 rounded-full mb-4">
              60-SECOND SETUP
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              Get Started in 60 Seconds
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
              No complex setup, no configuration files to edit manually.
              TestGenie just works.
            </p>
          </div>

          <div className="relative transform transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-900/20">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000"></div>
            <div className="bg-zinc-900 border border-zinc-700 rounded-lg overflow-hidden shadow-xl relative">
              <div className="bg-zinc-800 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="ml-4 text-zinc-400 text-sm font-medium">
                    Terminal
                  </span>
                </div>
                <div className="text-zinc-500 text-xs">testgenie@latest</div>
              </div>
              <div className="p-8 font-mono text-sm space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-green-900/30 flex items-center justify-center text-green-400 mr-4">
                      1
                    </div>
                    <span className="text-zinc-300">Install TestGenie</span>
                  </div>
                  <div className="pl-10">
                    <span className="text-zinc-500">$</span>{" "}
                    <span className="text-green-400">
                      npm install -g testgenie-ai
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-blue-900/30 flex items-center justify-center text-blue-400 mr-4">
                      2
                    </div>
                    <span className="text-zinc-300">
                      Initialize configuration
                    </span>
                  </div>
                  <div className="pl-10">
                    <span className="text-zinc-500">$</span>{" "}
                    <span className="text-blue-400">testgenie init</span>
                  </div>
                  <div className="pl-10 text-zinc-500 text-xs">
                    ✓ Detected Jest framework
                    <br />
                    ✓ Created configuration file
                    <br />✓ Selected BDD test style
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-yellow-900/30 flex items-center justify-center text-yellow-400 mr-4">
                      3
                    </div>
                    <span className="text-zinc-300">Generate tests</span>
                  </div>
                  <div className="pl-10">
                    <span className="text-zinc-500">$</span>{" "}
                    <span className="text-yellow-400">
                      testgenie gen src/components/Button.tsx
                    </span>
                  </div>
                </div>

                <div className="mt-6 pl-10 py-3 bg-green-900/20 rounded-lg border border-green-700/30 text-green-400 flex items-center">
                  <div className="w-5 h-5 mr-2">✅</div>
                  Generated 8 comprehensive tests with 95% coverage
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Framework Support */}
      <section className="py-24 px-4 bg-zinc-900/50 relative">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:40px_40px]"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-block px-3 py-1 text-sm font-medium bg-purple-900/30 text-purple-300 rounded-full mb-4">
            COMPATIBILITY
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white tracking-tight">
            Framework Support
          </h2>
          <p className="text-zinc-400 mb-16 max-w-2xl mx-auto text-lg">
            TestGenie works seamlessly with modern testing frameworks, with more
            integrations on the way
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group bg-gradient-to-b from-zinc-800/70 to-zinc-900/70 backdrop-blur-sm border border-zinc-700/50 rounded-xl p-8 hover:shadow-lg hover:shadow-green-900/10 transition-all duration-300 hover:border-green-600/30">
              <div className="w-16 h-16 rounded-full bg-green-900/20 border border-green-700/30 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <CheckCircle className="w-10 h-10 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Jest</h3>
              <div className="bg-green-900/20 text-green-400 rounded-full px-3 py-1 text-xs font-medium inline-block mb-4">
                FULLY SUPPORTED
              </div>
              <p className="text-zinc-400 leading-relaxed">
                Full integration with automatic setup, React Testing Library
                support, and TypeScript compatibility.
              </p>
              <div className="mt-6 pt-6 border-t border-zinc-700/50">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-400 text-sm">
                    Active Development
                  </span>
                </div>
              </div>
            </div>

            <div className="group bg-gradient-to-b from-zinc-800/70 to-zinc-900/70 backdrop-blur-sm border border-zinc-700/50 rounded-xl p-8 hover:shadow-lg hover:shadow-yellow-900/10 transition-all duration-300 hover:border-yellow-600/30">
              <div className="w-16 h-16 rounded-full bg-yellow-900/20 border border-yellow-700/30 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Clock className="w-10 h-10 text-yellow-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Vitest</h3>
              <div className="bg-yellow-900/20 text-yellow-400 rounded-full px-3 py-1 text-xs font-medium inline-block mb-4">
                COMING SOON
              </div>
              <p className="text-zinc-400 leading-relaxed">
                Fast Vite-native test runner support coming Q2 2025 with 80% of
                implementation already complete.
              </p>
              <div className="mt-6 pt-6 border-t border-zinc-700/50">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-yellow-400 text-sm">80% Complete</span>
                </div>
              </div>
            </div>

            <div className="group bg-gradient-to-b from-zinc-800/70 to-zinc-900/70 backdrop-blur-sm border border-zinc-700/50 rounded-xl p-8 hover:shadow-lg hover:shadow-blue-900/10 transition-all duration-300 hover:border-blue-600/30">
              <div className="w-16 h-16 rounded-full bg-blue-900/20 border border-blue-700/30 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Clock className="w-10 h-10 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Mocha</h3>
              <div className="bg-blue-900/20 text-blue-400 rounded-full px-3 py-1 text-xs font-medium inline-block mb-4">
                ROADMAP Q3 2025
              </div>
              <p className="text-zinc-400 leading-relaxed">
                Classic Node.js testing framework with comprehensive BDD and TDD
                interfaces planned for Q3 2025.
              </p>
              <div className="mt-6 pt-6 border-t border-zinc-700/50">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-blue-400 text-sm">In Development</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-28 px-4 relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-black to-blue-950/30"></div>

        {/* Animated dots/stars in background */}
        <div className="absolute inset-0 overflow-hidden opacity-30">
          <div className="absolute w-2 h-2 rounded-full bg-blue-400 top-1/4 left-1/4"></div>
          <div className="absolute w-1 h-1 rounded-full bg-purple-400 top-1/3 left-2/3"></div>
          <div className="absolute w-2 h-2 rounded-full bg-green-400 top-2/3 left-1/3"></div>
          <div className="absolute w-1 h-1 rounded-full bg-yellow-400 top-1/2 left-3/4"></div>
          <div className="absolute w-2 h-2 rounded-full bg-blue-400 top-3/4 left-1/4"></div>
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-block px-3 py-1 text-sm font-medium bg-blue-900/30 text-blue-300 rounded-full mb-6">
            TRANSFORM YOUR WORKFLOW
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8 text-white leading-tight tracking-tight">
            Ready to Transform
            <br className="hidden sm:block" /> Your Testing Process?
          </h2>

          <p className="text-xl text-zinc-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join thousands of developers who save hours every week with
            TestGenie AI. Start generating comprehensive tests in seconds.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center max-w-xl mx-auto">
            <Link
              to="/docs"
              className="group relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white px-8 py-4 rounded-xl font-medium transition-all duration-300 shadow-lg shadow-blue-900/20 hover:shadow-blue-600/30 text-lg w-full sm:w-auto overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Start Free{" "}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500"></div>
            </Link>

            <a
              href="https://github.com/testgenie-ai/testgenie/issues"
              className="inline-flex items-center justify-center gap-2 bg-zinc-800/80 backdrop-blur-sm hover:bg-zinc-700 text-white px-8 py-4 rounded-xl font-medium transition-all duration-300 border border-zinc-600 hover:border-zinc-500 shadow-lg shadow-zinc-900/20 hover:shadow-zinc-700/30 text-lg w-full sm:w-auto"
            >
              Request Feature
            </a>
          </div>

          <div className="mt-16 max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
            {[
              { value: "10,000+", label: "Downloads" },
              { value: "95%", label: "Average Coverage" },
              { value: "80%", label: "Time Saved" },
              { value: "24/7", label: "Support" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-zinc-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-900/80 backdrop-blur-sm border-t border-zinc-800 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <Bot className="w-8 h-8 text-blue-400" />
                <span className="text-2xl font-bold text-white">
                  TestGenie AI
                </span>
              </div>
              <p className="text-zinc-400 mb-6">
                AI-powered test generation for JavaScript and TypeScript
                projects.
              </p>
              <div className="flex gap-4">
                <a
                  href="https://github.com/testgenie-ai/testgenie"
                  className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:bg-blue-900/20 hover:text-blue-400 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
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
                </a>
                <a
                  href="https://twitter.com/testgenieai"
                  className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:bg-blue-900/20 hover:text-blue-400 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-white font-semibold mb-4">Product</h3>
                <ul className="space-y-3">
                  <li>
                    <Link
                      to="/docs"
                      className="text-zinc-400 hover:text-white transition-colors"
                    >
                      Documentation
                    </Link>
                  </li>
                  <li>
                    <a
                      href="#features"
                      className="text-zinc-400 hover:text-white transition-colors"
                    >
                      Features
                    </a>
                  </li>
                  <li>
                    <a
                      href="#pricing"
                      className="text-zinc-400 hover:text-white transition-colors"
                    >
                      Pricing
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-4">Resources</h3>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="https://github.com/testgenie-ai/testgenie"
                      className="text-zinc-400 hover:text-white transition-colors"
                    >
                      GitHub
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://github.com/testgenie-ai/testgenie/issues"
                      className="text-zinc-400 hover:text-white transition-colors"
                    >
                      Issue Tracker
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://github.com/testgenie-ai/testgenie/discussions"
                      className="text-zinc-400 hover:text-white transition-colors"
                    >
                      Discussions
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-4">Company</h3>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="/about"
                      className="text-zinc-400 hover:text-white transition-colors"
                    >
                      About
                    </a>
                  </li>
                  <li>
                    <a
                      href="/blog"
                      className="text-zinc-400 hover:text-white transition-colors"
                    >
                      Blog
                    </a>
                  </li>
                  <li>
                    <a
                      href="mailto:support@testgenie.ai"
                      className="text-zinc-400 hover:text-white transition-colors"
                    >
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-zinc-800 flex flex-col md:flex-row justify-between items-center text-zinc-500">
            <p>&copy; 2025 TestGenie AI. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a
                href="/privacy"
                className="text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="/terms"
                className="text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
