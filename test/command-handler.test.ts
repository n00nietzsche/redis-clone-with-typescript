import {
  beforeEach,
  describe,
  expect,
  it,
} from "vitest";
import { Store } from "../app/store";
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
    it("인자로 'Hello, World!' 를 받으면 SimpleString 타입으로 'Hello, World!' 를 응답한다.", () => {
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

    it('인자로 키, 값, "PX", 만료 까지 남은 시간(밀리초)을 받으면, 값을 store 에 저장하고, "OK"를 반환한다.', () => {
      const testKey = "key";
      const testValue = "value";

      const response = handler.set([
        testKey,
        testValue,
        "PX",
        "1000",
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

    it("만료된 키를 받으면, Null bulk string 을 반환한다.", () => {
      const testKey = "key";
      const testValue = "value";

      handler.set([
        testKey,
        testValue,
        "PX",
        "-1000",
      ]);

      const response = handler.get([testKey]);

      expect(response).toBe(toBulkString(null));
    });

    it("만료되지 않은 키를 받으면, 키에 저장된 값을 반환한다.", () => {
      const testKey = "key";
      const testValue = "value";

      handler.set([
        testKey,
        testValue,
        "PX",
        "+1000",
      ]);

      const response = handler.get([testKey]);

      expect(response).toBe(
        toBulkString(testValue)
      );
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
