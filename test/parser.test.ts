import { describe, expect, it } from "vitest";
import {
  parseArray,
  parseBulkString,
  parseClientCommand,
  splitByTerminator,
} from "../app/parser";
import { RedisRESPDataType } from "../app/enum/resp-data-type";

describe("Redis Parser 내부의", () => {
  describe("splitByTerminator() 메서드는", () => {
    it("terminator(\\r\\n) 로 구분된 문자열을 배열로 쪼갠다.", () => {
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

  describe("parseBulkString() 메서드는", () => {
    it("BulkString 형태로 들어온 문자열 입력을 IParseResult interface 로 변환한다.", () => {
      const input = "$5\r\nhello\r\n";

      const parsed = parseBulkString(input);

      expect(parsed).toEqual({
        type: RedisRESPDataType.BulkString,
        value: "hello",
      });
    });
  });

  describe("parseArray() 메서드는", () => {
    it("BulkString 원소 1개가 들어있는 RESP 배열 문자열 입력을 IParseResult interface 배열 형태로 변환한다.", () => {
      const input = "*1\r\n$5\r\nhello\r\n";

      const parsed = parseArray(input);

      expect(parsed).toEqual([
        {
          type: RedisRESPDataType.BulkString,
          value: "hello",
        },
      ]);
    });

    it("BulkString 원소 여러개가 들어있는 RESP 배열 문자열 입력을 IParseResult interface 배열 형태로 변환한다.", () => {
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

  describe("parseClientCommand() 메서드는", () => {
    it("명령어만 있는 RESP 배열 형태로 입력받은 문자열 입력을 명령어와 인자의 배열이 담긴 객체로 변환한다.", () => {
      const input = "*1\r\n$4\r\nPING\r\n";

      const parsed = parseClientCommand(input);

      expect(parsed).toEqual({
        command: "PING",
        args: [],
      });
    });

    it("명령어와 한개의 인자가 있는 RESP 배열 형태로 입력받은 문자열 입력을 명령어와 인자의 배열이 담긴 객체로 변환한다.", () => {
      const input =
        "*2\r\n$4\r\nECHO\r\n$5\r\nhello\r\n";

      const parsed = parseClientCommand(input);

      expect(parsed).toEqual({
        command: "ECHO",
        args: ["hello"],
      });
    });

    it("명령어와 여러 개의 인자가 있는 RESP 배열 형태로 입력받은 문자열 입력을 명령어와 인자의 배열이 담긴 객체로 변환한다.", () => {
      const input =
        "*3\r\n$3\r\nSET\r\n$3\r\nkey\r\n$5\r\nvalue\r\n";

      const parsed = parseClientCommand(input);

      expect(parsed).toEqual({
        command: "SET",
        args: ["key", "value"],
      });
    });

    it("유효하지 않은 RESP 배열 형태로 문자열을 입력받으면, 예외를 던진다.", () => {
      const input = "*-1\r\n";

      expect(() =>
        parseClientCommand(input)
      ).toThrowError("Invalid input");
    });
  });
});
