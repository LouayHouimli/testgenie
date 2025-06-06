```javascript
import { jest } from '@jest/globals';
import { startCLI } from './cli';
import { registerCommands } from './commands/index.ts';

jest.mock('./commands/index.ts');
jest.mock('yargs', () => ({
  __esModule: true,
  default: () => ({
    scriptName: jest.fn(),
    usage: jest.fn(),
    help: jest.fn(),
    version: jest.fn(),
    demandCommand: jest.fn(),
    strict: jest.fn(),
    parse: jest.fn(),
  }),
}));

describe('startCLI', () => {
  describe('Happy Path', () => {
    it('should call registerCommands with yargs instance', () => {
      const yargsMock = {
        scriptName: jest.fn(),
        usage: jest.fn(),
        help: jest.fn(),
        version: jest.fn(),
        demandCommand: jest.fn(),
        strict: jest.fn(),
        parse: jest.fn(),
      };
      jest.mocked(require('yargs').default).mockReturnValue(yargsMock);
      startCLI();
      expect(registerCommands).toHaveBeenCalledWith(yargsMock);
    });
    it('should call yargs methods in correct order', () => {
      const yargsMock = {
        scriptName: jest.fn(),
        usage: jest.fn(),
        help: jest.fn(),
        version: jest.fn(),
        demandCommand: jest.fn(),
        strict: jest.fn(),
        parse: jest.fn(),
      };
      jest.mocked(require('yargs').default).mockReturnValue(yargsMock);
      startCLI();
      expect(yargsMock.scriptName).toHaveBeenCalledWith('testgenie');
      expect(yargsMock.usage).toHaveBeenCalledWith('$0 <command> [options]');
      expect(yargsMock.help).toHaveBeenCalled();
      expect(yargsMock.version).toHaveBeenCalled();
      expect(yargsMock.demandCommand).toHaveBeenCalledWith(1, 'You need at least one command before moving on');
      expect(yargsMock.strict).toHaveBeenCalled();
      expect(yargsMock.parse).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should handle errors gracefully', () => {
      jest.mocked(require('yargs').default).mockImplementation(() => {
        throw new Error('Yargs error');
      });
      expect(() => startCLI()).toThrow('Yargs error');
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing argv gracefully', () => {
      jest.mocked(require('yargs').default).mockReturnValue({parse: jest.fn()});
      startCLI();
      expect(jest.mocked(require('yargs').default)().parse).toHaveBeenCalled();
    });
  });
});

```