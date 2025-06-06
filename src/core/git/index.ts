import type { GitChange } from "../../types/index.js";

export class GitAnalyzer {
  async getChangedFiles(since?: string): Promise<GitChange[]> {
    throw new Error("Not implemented yet");
  }

  async getCurrentDiff(): Promise<GitChange[]> {
    throw new Error("Not implemented yet");
  }

  async isGitRepository(): Promise<boolean> {
    throw new Error("Not implemented yet");
  }
}
