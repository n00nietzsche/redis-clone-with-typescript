import { describe, expect, it } from "vitest";

describe("Learning test", () => {
  it("the length increases by 1 for each blank space", () => {
    const zeroSpace =
      "ECHOECHOECHOECHOEHCOEHCOEHOCHOE";
    const split1 = zeroSpace.split(" ");
    expect(split1.length).toBe(1);

    const oneSpace = "ECHO hey";
    const split2 = oneSpace.split(" ");
    expect(split2.length).toBe(2);
  });

  it("First one be command and second one be argument", () => {
    const input = "ECHO hey";
    const [command, arg] = input.split(" ");
    expect(command).toBe("ECHO");
    expect(arg).toBe("hey");
  });
});
