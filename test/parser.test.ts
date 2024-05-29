import { describe } from "node:test";
import { expect, it } from "vitest";
import {
  parseArray,
  parseBulkString,
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
});
