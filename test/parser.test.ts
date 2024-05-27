import { describe } from "node:test";
import { expect, it } from "vitest";
import { parse, split } from "../app/parser";

describe("Split method", () => {
  it("should split string by \\r\\n", () => {
    const input =
      "*3\r\n$4\r\nECHO\r\n$3\r\nhey\r\n$8\r\nasdfasdf\r\n";
    const parsed = split(input);

    expect(parsed).toEqual([
      "*3",
      "$4",
      "ECHO",
      "$3",
      "hey",
      "$8",
      "asdfasdf",
    ]);
  });
});

describe("Parse method", () => {
  it("should parse the input string to object", () => {
    const input =
      "*3\r\n$4\r\nECHO\r\n$3\r\nhey\r\n$8\r\nasdfasdf\r\n";

    const parsed = parse(input);

    console.log("parsed", parsed);

    expect(parsed).toEqual({
      command: "ECHO",
      args: ["hey", "asdfasdf"],
    });
  });
});
