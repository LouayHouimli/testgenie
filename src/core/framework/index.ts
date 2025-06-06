import { readFile } from "fs-extra";
import { join } from "path";

export interface FrameworkConfig {
  name: "jest" | "vitest" | "mocha";
  version?: string;
  imports: string[];
  setupFiles?: string[];
  mocks: {
    function: string;
    module: string;
    timer: string;
  };
  assertions: {
    toBe: string;
    toEqual: string;
    toThrow: string;
    resolves: string;
    rejects: string;
  };
}

export class FrameworkDetector {
  async detectFramework(projectPath: string = "."): Promise<FrameworkConfig> {
    try {
      const packageJsonPath = join(projectPath, "package.json");
      const packageJson = JSON.parse(await readFile(packageJsonPath, "utf-8"));

      const allDeps = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies,
      };

      if (allDeps.vitest) {
        return this.getVitestConfig(allDeps.vitest);
      } else if (allDeps.jest || allDeps["@jest/globals"]) {
        return this.getJestConfig(allDeps.jest || allDeps["@jest/globals"]);
      } else if (allDeps.mocha) {
        return this.getMochaConfig(allDeps.mocha);
      }

      return this.getJestConfig();
    } catch {
      return this.getJestConfig();
    }
  }

  private getJestConfig(version?: string): FrameworkConfig {
    return {
      name: "jest",
      version,
      imports: [
        "import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';",
      ],
      mocks: {
        function: "jest.fn()",
        module: "jest.mock()",
        timer: "jest.useFakeTimers()",
      },
      assertions: {
        toBe: "expect(result).toBe(expected)",
        toEqual: "expect(result).toEqual(expected)",
        toThrow: "expect(() => fn()).toThrow()",
        resolves: "await expect(promise).resolves.toBe(expected)",
        rejects: "await expect(promise).rejects.toThrow()",
      },
    };
  }

  private getVitestConfig(version?: string): FrameworkConfig {
    return {
      name: "vitest",
      version,
      imports: [
        "import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';",
      ],
      mocks: {
        function: "vi.fn()",
        module: "vi.mock()",
        timer: "vi.useFakeTimers()",
      },
      assertions: {
        toBe: "expect(result).toBe(expected)",
        toEqual: "expect(result).toEqual(expected)",
        toThrow: "expect(() => fn()).toThrow()",
        resolves: "await expect(promise).resolves.toBe(expected)",
        rejects: "await expect(promise).rejects.toThrow()",
      },
    };
  }

  private getMochaConfig(version?: string): FrameworkConfig {
    return {
      name: "mocha",
      version,
      imports: [
        "import { describe, it } from 'mocha';",
        "import { expect } from 'chai';",
        "import sinon from 'sinon';",
      ],
      mocks: {
        function: "sinon.stub()",
        module: "sinon.stub()",
        timer: "sinon.useFakeTimers()",
      },
      assertions: {
        toBe: "expect(result).to.equal(expected)",
        toEqual: "expect(result).to.deep.equal(expected)",
        toThrow: "expect(() => fn()).to.throw()",
        resolves: "expect(await promise).to.equal(expected)",
        rejects: "expect(promise).to.be.rejected",
      },
    };
  }

  async hasReactTestingLibrary(): Promise<boolean> {
    try {
      const packageJson = await this.readPackageJson();
      const allDeps = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies,
      };

      return !!(
        allDeps["@testing-library/react"] ||
        allDeps["@testing-library/react-hooks"] ||
        allDeps["@testing-library/user-event"]
      );
    } catch {
      return false;
    }
  }

  async getReactTestingConfig(): Promise<{
    hasRTL: boolean;
    hasUserEvent: boolean;
    hasReactHooks: boolean;
    imports: string[];
    utilities: string[];
  }> {
    try {
      const packageJson = await this.readPackageJson();
      const allDeps = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies,
      };

      const hasRTL = !!allDeps["@testing-library/react"];
      const hasUserEvent = !!allDeps["@testing-library/user-event"];
      const hasReactHooks = !!allDeps["@testing-library/react-hooks"];

      const imports = [];
      const utilities = [];

      if (hasRTL) {
        imports.push(
          "import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';"
        );
        utilities.push("render", "screen", "fireEvent", "waitFor", "cleanup");
      }

      if (hasUserEvent) {
        imports.push("import userEvent from '@testing-library/user-event';");
        utilities.push("userEvent");
      }

      if (hasReactHooks) {
        imports.push(
          "import { renderHook, act } from '@testing-library/react-hooks';"
        );
        utilities.push("renderHook", "act");
      }

      return {
        hasRTL,
        hasUserEvent,
        hasReactHooks,
        imports,
        utilities,
      };
    } catch {
      return {
        hasRTL: false,
        hasUserEvent: false,
        hasReactHooks: false,
        imports: [],
        utilities: [],
      };
    }
  }

  private async readPackageJson(projectPath: string = "."): Promise<any> {
    const packageJsonPath = join(projectPath, "package.json");
    return JSON.parse(await readFile(packageJsonPath, "utf-8"));
  }

  async hasReact(projectPath: string = "."): Promise<boolean> {
    try {
      const packageJson = await this.readPackageJson(projectPath);

      const allDeps = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies,
      };

      return !!(allDeps.react || allDeps["@types/react"]);
    } catch {
      return false;
    }
  }
}
