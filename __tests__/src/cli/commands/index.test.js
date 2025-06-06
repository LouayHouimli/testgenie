```javascript
import { jest } from '@jest/globals';
import { registerCommands } from "./index.ts";
import type { Argv } from "yargs";

jest.mock("./gen.ts");
jest.mock("./scan.ts");
jest.mock("./audit.ts");
jest.mock("./init.ts");

const { registerGenCommand, registerScanCommand, registerAuditCommand, registerInitCommand } = jest.requireActual("./index.ts");


describe("registerCommands", () => {
  let cli: jest.Mocked<Argv>;

  beforeEach(() => {
    cli = { command: jest.fn() } as any;
  });

  it("should call all register commands with the provided cli instance", () => {
    registerCommands(cli);
    expect(registerGenCommand).toHaveBeenCalledWith(cli);
    expect(registerScanCommand).toHaveBeenCalledWith(cli);
    expect(registerAuditCommand).toHaveBeenCalledWith(cli);
    expect(registerInitCommand).toHaveBeenCalledWith(cli);
  });

  it("should handle null cli gracefully", () => {
    expect(() => registerCommands(null as any)).not.toThrow();
    expect(registerGenCommand).not.toHaveBeenCalled();
    expect(registerScanCommand).not.toHaveBeenCalled();
    expect(registerAuditCommand).not.toHaveBeenCalled();
    expect(registerInitCommand).not.toHaveBeenCalled();

  });

  it("should handle undefined cli gracefully", () => {
    expect(() => registerCommands(undefined as any)).not.toThrow();
    expect(registerGenCommand).not.toHaveBeenCalled();
    expect(registerScanCommand).not.toHaveBeenCalled();
    expect(registerAuditCommand).not.toHaveBeenCalled();
    expect(registerInitCommand).not.toHaveBeenCalled();
  });

  it("should handle empty cli gracefully", () => {
    const emptyCli = {} as Argv;
    registerCommands(emptyCli);
    expect(registerGenCommand).toHaveBeenCalledWith(emptyCli);
    expect(registerScanCommand).toHaveBeenCalledWith(emptyCli);
    expect(registerAuditCommand).toHaveBeenCalledWith(emptyCli);
    expect(registerInitCommand).toHaveBeenCalledWith(emptyCli);
  });


});
```
