```javascript
import { jest } from '@jest/globals';
import { registerGenCommand } from './gen';
import { consola } from 'consola';
import { existsSync, statSync } from 'fs-extra';
import { isSourceFile, getTestFilePath } from '../../utils/index.ts';
import { CodeParser } from '../../core/parser/index.ts';
import { GitManager } from '../../core/git/index.ts';
import { AITestGenerator } from '../../core/ai/index.ts';
import { writeFile, ensureDir } from 'fs-extra';
const path = require('path');


jest.mock('consola');
jest.mock('fs-extra');
jest.mock('../../core/parser/index.ts');
jest.mock('../../utils/index.ts');
jest.mock('../../core/git/index.ts');
jest.mock('../../core/ai/index.ts');


describe('registerGenCommand', () => {
  let cliMock;

  beforeEach(() => {
    cliMock = { command: jest.fn() };
  });

  it('should register the "gen" command', () => {
    registerGenCommand(cliMock);
    expect(cliMock.command).toHaveBeenCalledWith(
      'gen [file]',
      'Generate tests for specific file or git changes',
      expect.any(Function),
      expect.any(Function)
    );
  });

  describe('command handler', () => {
    it('should handle file input', async () => {
      const argv = { file: 'test.js', framework: 'jest', style: 'bdd', diff: false, since: undefined };
      const mockParser = { parseFile: jest.fn().mockResolvedValue({ functions: [] }) };
      jest.spyOn(console, 'error').mockImplementation(() => {});
      jest.spyOn(process, 'exit').mockImplementation(() => {});
      const handler = cliMock.command.mock.calls[0][2];
      await handler(argv);
      expect(mockParser.parseFile).toHaveBeenCalledWith('test.js');
    });

    it('should handle git diff input', async () => {
      const argv = { diff: true, framework: 'jest', style: 'bdd', file: undefined, since: undefined };
      const mockParser = { parseFile: jest.fn().mockResolvedValue({ functions: [] }) };
      const mockGit = { isGitRepository: jest.fn().mockResolvedValue(true), getUncommittedDiff: jest.fn().mockResolvedValue({ changes: [] }) };
      jest.spyOn(console, 'error').mockImplementation(() => {});
      jest.spyOn(process, 'exit').mockImplementation(() => {});
      const handler = cliMock.command.mock.calls[0][2];
      await handler(argv);
      expect(mockGit.isGitRepository).toHaveBeenCalled();
      expect(mockGit.getUncommittedDiff).toHaveBeenCalled();
    });

    it('should handle git since input', async () => {
      const argv = { since: '1 hour ago', framework: 'jest', style: 'bdd', file: undefined, diff: false };
      const mockParser = { parseFile: jest.fn().mockResolvedValue({ functions: [] }) };
      const mockGit = { isGitRepository: jest.fn().mockResolvedValue(true), getDiffSince: jest.fn().mockResolvedValue({ changes: [] }) };
      jest.spyOn(console, 'error').mockImplementation(() => {});
      jest.spyOn(process, 'exit').mockImplementation(() => {});
      const handler = cliMock.command.mock.calls[0][2];
      await handler(argv);
      expect(mockGit.isGitRepository).toHaveBeenCalled();
      expect(mockGit.getDiffSince).toHaveBeenCalledWith('1 hour ago');
    });

    it('should handle no input', async () => {
      const argv = { framework: 'jest', style: 'bdd', file: undefined, diff: false, since: undefined };
      const handler = cliMock.command.mock.calls[0][3];
      await handler(argv);
      expect(consola.error).toHaveBeenCalled();
      expect(process.exit).toHaveBeenCalledWith(1);
    });
  });
});

describe('generateTestsForFile', () => {
  it('should handle file not found', async () => {
    existsSync.mockReturnValue(false);
    const argv = { file: 'test.js' };
    const parser = {};
    await generateTestsForFile(argv, parser);
    expect(consola.error).toHaveBeenCalledWith('❌ File not found: test.js');
    expect(process.exit).toHaveBeenCalledWith(1);
  });

  it('should handle directory input', async () => {
    existsSync.mockReturnValue(true);
    statSync.mockReturnValue({ isDirectory: () => true });
    const argv = { file: 'testDir' };
    const parser = {};
    await generateTestsForFile(argv, parser);
    expect(consola.error).toHaveBeenCalledWith('❌ Cannot generate tests for a directory: testDir');
    expect(process.exit).toHaveBeenCalledWith(1);
  });

  it('should handle unsupported file type', async () => {
    existsSync.mockReturnValue(true);
    statSync.mockReturnValue({ isDirectory: () => false });
    isSourceFile.mockReturnValue(false);
    const argv = { file: 'test.txt' };
    const parser = {};
    await generateTestsForFile(argv, parser);
    expect(consola.error).toHaveBeenCalledWith('❌ Unsupported file type: test.txt');
    expect(process.exit).toHaveBeenCalledWith(1);
  });

  it('should handle parse error', async () => {
    existsSync.mockReturnValue(true);
    statSync.mockReturnValue({ isDirectory: () => false });
    isSourceFile.mockReturnValue(true);
    const parser = { parseFile: jest.fn().mockRejectedValue(new Error('Unexpected token')) };
    const argv = { file: 'test.js' };
    await generateTestsForFile(argv, parser);
    expect(consola.error).toHaveBeenCalledWith('❌ Unable to parse file: test.js');
    expect(process.exit).toHaveBeenCalledWith(1);
  });

  it('should successfully generate tests', async () => {
    existsSync.mockReturnValue(true);
    statSync.mockReturnValue({ isDirectory: () => false });
    isSourceFile.mockReturnValue(true);
    const parser = { parseFile: jest.fn().mockResolvedValue({ functions: [], filePath: 'test.js' }) };
    const argv = { file: 'test.js' };
    const generateAndSaveTestsMock = jest.fn();
    jest.mock('../../core/ai/index.ts', () => ({ AITestGenerator: jest.fn(() => ({ generateTests: generateAndSaveTestsMock })) }));
    await generateTestsForFile(argv, parser);
    expect(generateAndSaveTestsMock).toHaveBeenCalled();
  });
});

describe('generateTestsForGitChanges', () => {
  it('should handle not a git repository', async () => {
    const argv = {};
    const parser = {};
    const git = { isGitRepository: jest.fn().mockResolvedValue(false) };
    await generateTestsForGitChanges(argv, parser, git);
    expect(consola.error).toHaveBeenCalledWith('❌ Not a git repository');
    expect(process.exit).toHaveBeenCalledWith(1);
  });

  it('should handle no code changes', async () => {
    const argv = {};
    const parser = {};
    const git = { isGitRepository: jest.fn().mockResolvedValue(true), getUncommittedDiff: jest.fn().mockResolvedValue({ changes: [] }) };
    await generateTestsForGitChanges(argv, parser, git);
    expect(consola.info).toHaveBeenCalledWith('✨ No code changes found to generate tests for');
  });

  it('should successfully generate tests', async () => {
    const argv = {};
    const parser = { parseFile: jest.fn().mockResolvedValue({ functions: [], filePath: 'test.js' }) };
    const git = { isGitRepository: jest.fn().mockResolvedValue(true), getUncommittedDiff: jest.fn().mockResolvedValue({ changes: [{ file: 'test.js', status: 'modified' }] }) };
    const generateAndSaveTestsMock = jest.fn();
    jest.mock('../../core/ai/index.ts', () => ({ AITestGenerator: jest.fn(() => ({ generateTests: generateAndSaveTestsMock })) }));
    await generateTestsForGitChanges(argv, parser, git);
    expect(generateAndSaveTestsMock).toHaveBeenCalled();
  });
});

describe('generateAndSaveTests', () => {
  it('should handle AI API