import { Socket } from "net";
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { Store } from "../app/store";
import { CommandExecutor } from "../app/command-executor";
import {
  toBulkString,
  toSimpleString,
} from "../app/parser";
import { CommandHandler } from "../app/command-handler";

describe("CommandHandler 클래스의", () => {
  let store: Store;
  let handler: CommandHandler;

  beforeEach(() => {
    store = new Store();
    handler = new CommandHandler(store);
  });

  describe("echo() 메서드는", () => {
    it("인자로 문자열을 받으면 RESP 프로토콜의 SimpleString 형태로 문자를 반환한다.", () => {
      const testString = "Hello, World!";
      const response = handler.echo([testString]);

      expect(response).toBe(
        toSimpleString(testString)
      );
    });
  });

  describe("set() 메서드는", () => {
    it('인자로 키와 값을 받으면, 값을 store 에 저장하고, "OK"를 반환한다.', () => {
      const testKey = "key";
      const testValue = "value";

      const response = handler.set([
        testKey,
        testValue,
      ]);

      expect(response).toBe(toSimpleString("OK"));

      expect(store.get(testKey)).toEqual(
        testValue
      );
    });
  });

  describe("get() 메서드는", () => {
    it("store 에 저장된 값이 있을 때, 인자로 키를 받아 해당 키의 값을 반환한다.", () => {
      const testKey = "key";
      const testValue = "value";

      store.set(testKey, testValue);
      const response = handler.get([testKey]);

      expect(response).toBe(
        toBulkString(testValue)
      );
    });

    it("존재하지 않는 키를 받으면, Null bulk string 을 반환한다.", () => {
      const testKey = "key that doesn't exist";
      const response = handler.get([testKey]);

      expect(response).toBe(toBulkString(null));
    });
  });

  describe("ping() 메서드는", () => {
    it('RESP 프로토콜의 SimpleString 형태로 "PONG"을 반환한다.', () => {
      const response = handler.ping();

      expect(response).toBe(
        toSimpleString("PONG")
      );
    });
  });
});
