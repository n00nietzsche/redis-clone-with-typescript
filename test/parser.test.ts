import { describe } from "node:test";
import { expect, it } from "vitest";
import {
  parseArray,
  parseBulkString,
  parseClientCommand,
  splitByTerminator,
} from "../app/parser";
import { RedisRESPDataType } from "../app/enum/resp-data-type";

describe("split by terminal method", () => {
  it("should split string by protocol terminator(\\r\\n)", () => {
    const input =
      "*3\r\n$4\r\nECHO\r\n$3\r\nhey\r\n$8\r\nasdfasdf\r\n";
    const parsed = splitByTerminator(input);

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

describe("parse bulk string method", () => {
  it("should parse bulk string input to IParseResult interface", () => {
    const input = "$5\r\nhello\r\n";

    const parsed = parseBulkString(input);

    expect(parsed).toEqual({
      type: RedisRESPDataType.BulkString,
      value: "hello",
    });
  });
});

describe("parse array method", () => {
  it("should parse array string input to array of IParseResult interface", () => {
    const input = "*1\r\n$5\r\nhello\r\n";

    const parsed = parseArray(input);

    expect(parsed).toEqual([
      {
        type: RedisRESPDataType.BulkString,
        value: "hello",
      },
    ]);
  });

  it("should parse array string input to array of IParseResult interface", () => {
    const input =
      "*3\r\n$4\r\nECHO\r\n$3\r\nhey\r\n$8\r\nasdfasdf\r\n";

    const parsed = parseArray(input);

    expect(parsed).toEqual([
      {
        type: RedisRESPDataType.BulkString,
        value: "ECHO",
      },
      {
        type: RedisRESPDataType.BulkString,
        value: "hey",
      },
      {
        type: RedisRESPDataType.BulkString,
        value: "asdfasdf",
      },
    ]);
  });
});

describe("parse client command method", () => {
  it("should parse command with no arguments", () => {
    const input = "*1\r\n$4\r\nPING\r\n";

    const parsed = parseClientCommand(input);

    expect(parsed).toEqual({
      command: "PING",
      args: [],
    });
  });

  it("should parse command with one argument", () => {
    const input =
      "*2\r\n$4\r\nECHO\r\n$5\r\nhello\r\n";

    const parsed = parseClientCommand(input);

    expect(parsed).toEqual({
      command: "ECHO",
      args: ["hello"],
    });
  });

  it("should parse command with multiple arguments", () => {
    const input =
      "*3\r\n$3\r\nSET\r\n$3\r\nkey\r\n$5\r\nvalue\r\n";

    const parsed = parseClientCommand(input);

    expect(parsed).toEqual({
      command: "SET",
      args: ["key", "value"],
    });
  });

  it("should throw error when input is invalid", () => {
    const input = "*-1\r\n";

    expect(() =>
      parseClientCommand(input)
    ).toThrowError("Invalid input");
  });
});
