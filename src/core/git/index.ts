import { simpleGit, SimpleGit } from "simple-git";
import { extname } from "path";
import type { GitDiffInfo, GitFileChange } from "../../types/index.ts";

export class GitManager {
  private git: SimpleGit;

  constructor(repoPath?: string) {
    this.git = simpleGit(repoPath || process.cwd());
  }

  async isGitRepository(): Promise<boolean> {
    try {
      await this.git.status();
      return true;
    } catch {
      return false;
    }
  }

  async getDiffSince(since?: string): Promise<GitDiffInfo> {
    const isRepo = await this.isGitRepository();
    if (!isRepo) {
      throw new Error("Not a git repository");
    }

    let diffText: string;

    if (since) {
      const log = await this.git.log({ "--since": since });
      if (log.all.length === 0) {
        diffText = "";
      } else {
        const oldestCommit = log.all[log.all.length - 1].hash;
        diffText = await this.git.diff([`${oldestCommit}^`, "HEAD"]);
      }
    } else {
      diffText = await this.git.diff(["HEAD^", "HEAD"]);
    }

    const changes = await this.parseGitStatus();

    const codeFiles = [];
    for (const change of changes) {
      if (await this.isCodeFile(change.file)) {
        codeFiles.push(change);
      }
    }

    return {
      changes,
      diffText,
      totalFiles: changes.length,
      codeFiles: codeFiles.length,
    };
  }

  async getStagedDiff(): Promise<GitDiffInfo> {
    const isRepo = await this.isGitRepository();
    if (!isRepo) {
      throw new Error("Not a git repository");
    }

    const diffText = await this.git.diff(["--cached"]);
    const changes = await this.parseGitStatus();
    const stagedChanges = changes.filter((change) => change.staged);

    const codeFiles = [];
    for (const change of stagedChanges) {
      if (await this.isCodeFile(change.file)) {
        codeFiles.push(change);
      }
    }

    return {
      changes: stagedChanges,
      diffText,
      totalFiles: stagedChanges.length,
      codeFiles: codeFiles.length,
    };
  }

  async getUncommittedDiff(): Promise<GitDiffInfo> {
    const isRepo = await this.isGitRepository();
    if (!isRepo) {
      throw new Error("Not a git repository");
    }

    const diffText = await this.git.diff();
    const changes = await this.parseGitStatus();
    const modifiedChanges = changes.filter(
      (change) => change.modified && !change.staged
    );

    const codeFiles = [];
    for (const change of modifiedChanges) {
      if (await this.isCodeFile(change.file)) {
        codeFiles.push(change);
      }
    }

    return {
      changes: modifiedChanges,
      diffText,
      totalFiles: modifiedChanges.length,
      codeFiles: codeFiles.length,
    };
  }

  private async parseGitStatus(): Promise<GitFileChange[]> {
    const status = await this.git.status();
    const changes: GitFileChange[] = [];

    status.modified.forEach((file) => {
      changes.push({
        file,
        status: "modified",
        staged: false,
        modified: true,
      });
    });

    status.created.forEach((file) => {
      changes.push({
        file,
        status: "added",
        staged: false,
        modified: true,
      });
    });

    status.deleted.forEach((file) => {
      changes.push({
        file,
        status: "deleted",
        staged: false,
        modified: true,
      });
    });

    status.staged.forEach((file) => {
      const existingChange = changes.find((c) => c.file === file);
      if (existingChange) {
        existingChange.staged = true;
      } else {
        changes.push({
          file,
          status: "staged",
          staged: true,
          modified: false,
        });
      }
    });

    return changes;
  }

  private async isCodeFile(filePath: string): Promise<boolean> {
    const { isSourceFile } = await import("../../utils/index.ts");
    return isSourceFile(filePath);
  }

  async getCurrentBranch(): Promise<string> {
    const status = await this.git.status();
    return status.current || "main";
  }

  async getRecentCommits(count: number = 5): Promise<string[]> {
    const log = await this.git.log({ maxCount: count });
    return log.all.map(
      (commit) => `${commit.hash.slice(0, 7)} - ${commit.message}`
    );
  }
}
