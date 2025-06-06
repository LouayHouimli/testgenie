```javascript
import { jest } from '@jest/globals';
import { GitManager } from './gitManager';
import { simpleGit, SimpleGit } from 'simple-git';
import { extname } from 'path';

jest.mock('simple-git');

const mockSimpleGit = simpleGit as jest.Mocked<typeof simpleGit>;

describe('GitManager', () => {
  let gitManager: GitManager;

  beforeEach(() => {
    mockSimpleGit.mockClear();
    gitManager = new GitManager();
  });

  describe('isGitRepository', () => {
    it('should return true if it is a git repository', async () => {
      mockSimpleGit.mockImplementation(() => ({
        status: jest.fn().mockResolvedValue({}),
      }));
      expect(await gitManager.isGitRepository()).toBe(true);
    });

    it('should return false if it is not a git repository', async () => {
      mockSimpleGit.mockImplementation(() => ({
        status: jest.fn().mockRejectedValue(new Error('Not a git repository')),
      }));
      expect(await gitManager.isGitRepository()).toBe(false);
    });
  });

  describe('getDiffSince', () => {
    it('should return diff information since a specified date', async () => {
      const mockLog = { all: [{ hash: 'abcdef' }] };
      const mockDiff = 'diff text';
      mockSimpleGit.mockImplementation(() => ({
        log: jest.fn().mockResolvedValue(mockLog),
        diff: jest.fn().mockResolvedValue(mockDiff),
        status: jest.fn().mockResolvedValue({}),
      }));
      const diffInfo = await gitManager.getDiffSince('1 week ago');
      expect(diffInfo.diffText).toBe(mockDiff);
    });
    it('should handle empty log', async () => {
      mockSimpleGit.mockImplementation(() => ({
        log: jest.fn().mockResolvedValue({ all: [] }),
        diff: jest.fn(),
        status: jest.fn().mockResolvedValue({}),
      }));
      const diffInfo = await gitManager.getDiffSince('1 week ago');
      expect(diffInfo.diffText).toBe('');
    });
    it('should throw an error if not a git repository', async () => {
      mockSimpleGit.mockImplementation(() => ({
        status: jest.fn().mockRejectedValue(new Error('Not a git repository')),
      }));
      await expect(gitManager.getDiffSince('1 week ago')).rejects.toThrowError(
        'Not a git repository'
      );
    });
  });

  describe('getStagedDiff', () => {
    it('should return staged diff information', async () => {
      mockSimpleGit.mockImplementation(() => ({
        diff: jest.fn().mockResolvedValue('staged diff'),
        status: jest.fn().mockResolvedValue({ staged: ['file1.js'] }),
      }));
      const diffInfo = await gitManager.getStagedDiff();
      expect(diffInfo.diffText).toBe('staged diff');
    });
    it('should throw an error if not a git repository', async () => {
      mockSimpleGit.mockImplementation(() => ({
        status: jest.fn().mockRejectedValue(new Error('Not a git repository')),
      }));
      await expect(gitManager.getStagedDiff()).rejects.toThrowError(
        'Not a git repository'
      );
    });
  });

  describe('getUncommittedDiff', () => {
    it('should return uncommitted diff information', async () => {
      mockSimpleGit.mockImplementation(() => ({
        diff: jest.fn().mockResolvedValue('uncommitted diff'),
        status: jest.fn().mockResolvedValue({ modified: ['file2.ts'] }),
      }));
      const diffInfo = await gitManager.getUncommittedDiff();
      expect(diffInfo.diffText).toBe('uncommitted diff');
    });
    it('should throw an error if not a git repository', async () => {
      mockSimpleGit.mockImplementation(() => ({
        status: jest.fn().mockRejectedValue(new Error('Not a git repository')),
      }));
      await expect(gitManager.getUncommittedDiff()).rejects.toThrowError(
        'Not a git repository'
      );
    });
  });

  describe('parseGitStatus', () => {
    it('should parse git status correctly', async () => {
      mockSimpleGit.mockImplementation(() => ({
        status: jest.fn().mockResolvedValue({
          modified: ['file1.js'],
          created: ['file2.ts'],
          deleted: ['file3.js'],
          staged: ['file1.js'],
        }),
      }));
      const changes = await gitManager.parseGitStatus();
      expect(changes.length).toBe(3);
      expect(changes.find((c) => c.file === 'file1.js')?.staged).toBe(true);
    });
  });

  describe('isCodeFile', () => {
    it('should return true for code files', () => {
      expect(gitManager.isCodeFile('file.js')).toBe(true);
      expect(gitManager.isCodeFile('file.ts')).toBe(true);
    });
    it('should return false for non-code files', () => {
      expect(gitManager.isCodeFile('file.txt')).toBe(false);
    });
  });

  describe('getCurrentBranch', () => {
    it('should return the current branch', async () => {
      mockSimpleGit.mockImplementation(() => ({
        status: jest.fn().mockResolvedValue({ current: 'feature/new' }),
      }));
      expect(await gitManager.getCurrentBranch()).toBe('feature/new');
    });
    it('should return main if current branch is undefined', async () => {
      mockSimpleGit.mockImplementation(() => ({
        status: jest.fn().mockResolvedValue({}),
      }));
      expect(await gitManager.getCurrentBranch()).toBe('main');
    });
  });

  describe('getRecentCommits', () => {
    it('should return recent commits', async () => {
      mockSimpleGit.mockImplementation(() => ({
        log: jest.fn().mockResolvedValue({
          all: [{ hash: 'abcdef123456', message: 'commit message' }],
        }),
      }));
      const commits = await gitManager.getRecentCommits();
      expect(commits[0]).toBe('abcdef - commit message');
    });
  });
});
```