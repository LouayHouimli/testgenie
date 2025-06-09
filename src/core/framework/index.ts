import { readFile } from "fs-extra";
import { join } from "path";

export interface FrameworkConfig {
  name: "jest"; // vitest and mocha coming soon
  version?: string;
  imports: string;
  mocks: {
    function: string;
    module: string;
    clear: string;
    restore: string;
  };
  assertions: {
    equal: string;
    notEqual: string;
    truthy: string;
    falsy: string;
    throws: string;
  };
}

export class FrameworkDetector {
  async detectFramework(): Promise<FrameworkConfig> {
    const fs = await import("fs-extra");

    let packageJson: any = {};
    try {
      if (await fs.pathExists("package.json")) {
        packageJson = await fs.readJson("package.json");
      }
    } catch (error) {
      packageJson = {};
    }

    const allDeps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };

    if (allDeps.vitest) {
      throw new Error(
        "Vitest detected but not yet supported. Jest support only for now. Vitest coming soon!"
      );
    } else if (allDeps.mocha) {
      throw new Error(
        "Mocha detected but not yet supported. Jest support only for now. Mocha coming soon!"
      );
    } else if (allDeps.jest || allDeps["@jest/globals"]) {
      return this.getJestConfig(allDeps.jest);
    } else {
      return this.getJestConfig();
    }
  }

  private getJestConfig(version?: string): FrameworkConfig {
    return {
      name: "jest",
      version,
      imports:
        "import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';",
      mocks: {
        function: "jest.fn()",
        module: "jest.mock()",
        clear: "jest.clearAllMocks()",
        restore: "jest.restoreAllMocks()",
      },
      assertions: {
        equal: "expect(result).toBe(expected)",
        notEqual: "expect(result).not.toBe(expected)",
        truthy: "expect(result).toBeTruthy()",
        falsy: "expect(result).toBeFalsy()",
        throws: "expect(() => fn()).toThrow()",
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
