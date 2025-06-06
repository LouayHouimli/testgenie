```javascript
import { jest } from '@jest/globals';
import { CodeParser } from '../src/CodeParser';
import { globby } from 'globby';
import { readFile } from 'fs-extra';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import type { ParsedFile, ParsedFunction } from "../../types/index.js";


jest.mock('globby');
jest.mock('fs-extra');
jest.mock('@babel/parser');
jest.mock('@babel/traverse');


describe('CodeParser', () => {
  let parser: CodeParser;

  beforeEach(() => {
    parser = new CodeParser();
  });

  describe('findSourceFiles', () => {
    it('should return an empty array for an empty directory', async () => {
      (globby as jest.MockedFunction<typeof globby>).mockResolvedValue([]);
      const result = await parser.findSourceFiles('test');
      expect(result).toEqual([]);
    });

    it('should return an array of source files', async () => {
      (globby as jest.MockedFunction<typeof globby>).mockResolvedValue(['test.js', 'test.ts']);
      const result = await parser.findSourceFiles('test');
      expect(result).toEqual(['test.js', 'test.ts']);
    });

    it('should handle errors from globby', async () => {
      (globby as jest.MockedFunction<typeof globby>).mockRejectedValue(new Error('Globby error'));
      await expect(parser.findSourceFiles('test')).rejects.toThrow('Globby error');
    });
  });

  describe('findTestFiles', () => {
    it('should return an empty array for an empty directory', async () => {
      (globby as jest.MockedFunction<typeof globby>).mockResolvedValue([]);
      const result = await parser.findTestFiles('test');
      expect(result).toEqual([]);
    });

    it('should return an array of test files', async () => {
      (globby as jest.MockedFunction<typeof globby>).mockResolvedValue(['test.spec.js', '__tests__/test.js']);
      const result = await parser.findTestFiles('test');
      expect(result).toEqual(['test.spec.js', '__tests__/test.js']);
    });
    it('should handle errors from globby', async () => {
      (globby as jest.MockedFunction<typeof globby>).mockRejectedValue(new Error('Globby error'));
      await expect(parser.findTestFiles('test')).rejects.toThrow('Globby error');
    });
  });

  describe('discoverFiles', () => {
    it('should return an empty object for an empty directory', async () => {
      (globby as jest.MockedFunction<typeof globby>).mockResolvedValue([]);
      const result = await parser.discoverFiles('test');
      expect(result).toEqual({ sourceFiles: [], testFiles: [] });
    });

    it('should return source and test files', async () => {
      (globby as jest.MockedFunction<typeof globby>).mockResolvedValueOnce(['test.js']).mockResolvedValueOnce(['test.spec.js']);
      const result = await parser.discoverFiles('test');
      expect(result).toEqual({ sourceFiles: ['test.js'], testFiles: ['test.spec.js'] });
    });
    it('should handle errors from globby', async () => {
      (globby as jest.MockedFunction<typeof globby>).mockRejectedValueOnce(new Error('Globby error'));
      await expect(parser.discoverFiles('test')).rejects.toThrow('Globby error');
    });
  });

  describe('parseFile', () => {
    it('should parse a file and return a ParsedFile object', async () => {
      (readFile as jest.MockedFunction<typeof readFile>).mockResolvedValue('//test');
      (parse as jest.MockedFunction<typeof parse>).mockReturnValue({ type: 'File' });
      (traverse as jest.MockedFunction<typeof traverse>).mockImplementation(() => {});

      const result = await parser.parseFile('test.js');
      expect(result).toEqual({ filePath: 'test.js', functions: [], imports: [], exports: [] });
    });

    it('should handle errors from readFile', async () => {
      (readFile as jest.MockedFunction<typeof readFile>).mockRejectedValue(new Error('Readfile error'));
      await expect(parser.parseFile('test.js')).rejects.toThrow('Readfile error');
    });

    it('should handle errors from parse', async () => {
      (readFile as jest.MockedFunction<typeof readFile>).mockResolvedValue('//test');
      (parse as jest.MockedFunction<typeof parse>).mockImplementation(() => { throw new Error('Parse error')});
      await expect(parser.parseFile('test.js')).rejects.toThrow('Parse error');
    });
  });

  describe('extractFunctions', () => {
    it('should extract functions from an AST', () => {
      const ast = { type: 'File' };
      (traverse as jest.MockedFunction<typeof traverse>).mockImplementation((ast: any, visitor: any) => {
        visitor.FunctionDeclaration({ node: { id: { name: 'test' }, params: [], async: false, loc: { start: { line: 1 }, end: { line: 2 } } } });
      });
      const result = parser.extractFunctions(ast);
      expect(result).toEqual([{ name: 'test', params: [], returnType: undefined, isAsync: false, isExported: false, startLine: 1, endLine: 2 }]);
    });
  });

  describe('extractImports', () => {
    it('should extract imports from an AST', () => {
      const ast = { type: 'File' };
      (traverse as jest.MockedFunction<typeof traverse>).mockImplementation((ast: any, visitor: any) => {
        visitor.ImportDeclaration({ node: { source: { value: './test' } } });
      });
      const result = parser.extractImports(ast);
      expect(result).toEqual(['./test']);
    });
  });

  describe('extractExports', () => {
    it('should extract exports from an AST', () => {
      const ast = { type: 'File' };
      (traverse as jest.MockedFunction<typeof traverse>).mockImplementation((ast: any, visitor: any) => {
        visitor.ExportNamedDeclaration({ node: { declaration: { type: 'FunctionDeclaration', id: { name: 'test' } } } });
      });
      const result = parser.extractExports(ast);
      expect(result).toEqual(['test']);
    });
  });
});
```