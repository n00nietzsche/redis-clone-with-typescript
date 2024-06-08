import { once } from "events";
import * as net from "net";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
} from "vitest";
import {
  toBulkString,
  toSimpleString,
} from "../app/parser";
import { getRedisServer } from "../app/main";
import { Store } from "../app/store";
import { RedisServerInfo } from "../app/server-info";

async function sendInput(input: string) {
  const client = net.createConnection(
    { port: 6380, host: "127.0.0.1" },
    () => {
      client.write(input);
    }
  );

  const [response] = await once(client, "data");
  client.end();
  return response;
}

describe("Redis 서버 애플리케이션은", () => {
  const port = 6380;
  const host = "127.0.0.1";

  let server;
  let serverInfo = new RedisServerInfo({
    replicationParams: {
      role: "master",
      master_replid:
        "8371b4fb1155b71f4a04d3e1bc3e18c4a990aeeb",
      master_repl_offset: 0,
    },
    serverParams: {
      port,
    },
  });

  beforeEach(() => {
    server = getRedisServer(
      new Store(),
      serverInfo
    );
    server.listen(port, host);
  });

  afterEach(() => {
    server.close();
  });

  describe("PING 명령을 받으면", () => {
    it("SimpleString 타입의 PONG 을 응답한다.", async () => {
      const response = await sendInput(
        "*1\r\n$4\r\nPING\r\n"
      );

      expect(response.toString()).toBe(
        toSimpleString("PONG")
      );
    });
  });

  describe("ECHO 명령어를 받았을 때", () => {
    it("hey 라는 문자열을 인자로 받으면, SimpleString 타입의 hey 를 응답한다.", async () => {
      const data = await sendInput(
        "*2\r\n$4\r\nECHO\r\n$3\r\nhey\r\n"
      );

      expect(data.toString()).toBe(
        toSimpleString("hey")
      );
    });

    const testCases = [
      "aasdfasdtartawrt",
      "a",
      "1",
      "#",
      "$",
    ];

    testCases.forEach((testString) => {
      it(`${testString} 문자열을 인자로 받으면, SimpleString 타입의 ${testString} 를 응답한다.`, async () => {
        const data = await sendInput(
          `*2\r\n$4\r\nECHO\r\n$${testString.length}\r\n${testString}\r\n`
        );

        expect(data.toString()).toBe(
          `+${testString}\r\n`
        );
      });
    });
  });

  describe("SET 명령어를 받았을 때", () => {
    it("유효한 key 와 value 를 받으면, SimpleString 타입의 OK 를 응답한다.", async () => {
      const data = await sendInput(
        "*3\r\n$3\r\nSET\r\n$3\r\nkey\r\n$5\r\nvalue\r\n"
      );

      expect(data.toString()).toBe(
        toSimpleString("OK")
      );
    });

    const testCases = [
      ["a", "b"],
      ["1", "2"],
      ["#", "$"],
      ["asdfasdf", "asdfasdf"],
    ];

    testCases.forEach(([key, value]) => {
      it(`키로 ${key} 를 받고 값으로 ${value} 를 받으면, SimpleString 타입의 OK 를 응답한다.`, async () => {
        const data = await sendInput(
          `*3\r\n$3\r\nSET\r\n$${key.length}\r\n${key}\r\n$${value.length}\r\n${value}\r\n`
        );

        expect(data.toString()).toBe(
          toSimpleString("OK")
        );
      });
    });
  });

  describe("GET 명령어를 받았을 때", () => {
    it("존재하지 않는 키를 인자로 받으면, null bulk stirng 을 응답한다.", async () => {
      const data = await sendInput(
        "*2\r\n$3\r\nGET\r\n$3\r\nkey\r\n"
      );

      expect(data.toString()).toBe(
        toBulkString(null)
      );
    });

    it("존재하는 키를 인자로 받으면, 해당 키에 대한 값을 BulkString 타입으로 응답한다.", async () => {
      const data = await sendInput(
        "*3\r\n$3\r\nSET\r\n$3\r\nkey\r\n$5\r\nvalue\r\n"
      );

      expect(data.toString()).toBe(
        toSimpleString("OK")
      );

      const data2 = await sendInput(
        "*2\r\n$3\r\nGET\r\n$3\r\nkey\r\n"
      );

      expect(data2.toString()).toBe(
        toBulkString("value")
      );
    });

    it("존재하는 키를 인자로 받으면, 만료되지 않았을 때 값을 BulkString 타입으로 응답한다.", async () => {
      const data = await sendInput(
        "*5\r\n$3\r\nSET\r\n$6\r\nbanana\r\n$9\r\npineapple\r\n$2\r\npx\r\n$3\r\n100\r\n"
      );

      expect(data.toString()).toBe(
        toSimpleString("OK")
      );

      const data2 = await sendInput(
        "*2\r\n$3\r\nGET\r\n$6\r\nbanana\r\n"
      );

      expect(data2.toString()).toBe(
        toBulkString("pineapple")
      );
    });

    it("존재하는 키를 인자로 받으면, 만료되었을 때 값을 NullBulkString 타입으로 응답한다.", async () => {
      const data = await sendInput(
        "*5\r\n$3\r\nSET\r\n$6\r\nbanana\r\n$9\r\npineapple\r\n$2\r\npx\r\n:-100\r\n"
      );

      expect(data.toString()).toBe(
        toSimpleString("OK")
      );

      const data2 = await sendInput(
        "*2\r\n$3\r\nGET\r\n$6\r\nbanana\r\n"
      );

      expect(data2.toString()).toBe(
        toBulkString(null)
      );
    });
  });

  describe("INFO 명령어를 받았을 때", () => {
    it("REPLICATION 인자를 받으면, replication 정보를 BulkString 타입으로 응답한다.", async () => {
      const data = await sendInput(
        "*2\r\n$4\r\nINFO\r\n$11\r\nREPLICATION\r\n"
      );

      expect(data.toString()).toBe(
        toBulkString(
          serverInfo.getReplicationInfo()
        )
      );
    });
  });
});
