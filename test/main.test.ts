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

async function sendInput(
  input: string,
  server: net.Server
) {
  const client = net.createConnection(
    { port: 6380, host: "127.0.0.1" },
    () => {
      client.write(input);
    }
  );

  const [data] = await once(client, "data");
  client.end();
  return data;
}

describe("PING command", () => {
  let server;

  beforeEach(() => {
    server = getRedisServer(new Store());
    server.listen(6380, "127.0.0.1");
  });

  afterEach(() => {
    server.close();
  });

  it("should respond with +PONG\\r\\n when client sends PING\\r\\n", async () => {
    const data = await sendInput(
      "*1\r\n$4\r\nPING\r\n",
      server
    );

    expect(data.toString()).toBe(
      toSimpleString("PONG")
    );
  });
});

describe("ECHO command", () => {
  let server;

  beforeEach(() => {
    server = getRedisServer(new Store());
    server.listen(6380, "127.0.0.1");
  });

  afterEach(() => {
    server.close();
  });

  it("should respond with hey when client sends ECHO hey", async () => {
    const data = await sendInput(
      "*2\r\n$4\r\nECHO\r\n$3\r\nhey\r\n",
      server
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
    it(`should respond with ${testString} when client sends ECHO ${testString}`, async () => {
      const data = await sendInput(
        `*2\r\n$4\r\nECHO\r\n$${testString.length}\r\n${testString}\r\n`,
        server
      );

      expect(data.toString()).toBe(
        `+${testString}\r\n`
      );
    });
  });
});

describe("SET command", () => {
  let server;

  beforeEach(() => {
    server = getRedisServer(new Store());
    server.listen(6380, "127.0.0.1");
  });

  afterEach(() => {
    server.close();
  });

  it("should respond with +OK\\r\\n when client sends SET key value", async () => {
    const data = await sendInput(
      "*3\r\n$3\r\nSET\r\n$3\r\nkey\r\n$5\r\nvalue\r\n",
      server
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
    it(`should respond with +OK\\r\\n when client sends SET ${key} ${value}`, async () => {
      const data = await sendInput(
        `*3\r\n$3\r\nSET\r\n$${key.length}\r\n${key}\r\n$${value.length}\r\n${value}\r\n`,
        server
      );

      expect(data.toString()).toBe(
        toSimpleString("OK")
      );
    });
  });
});

describe("GET command", () => {
  let server;

  beforeEach(() => {
    server = getRedisServer(new Store());
    server.listen(6380, "127.0.0.1");
  });

  afterEach(() => {
    server.close();
  });

  it("should respond with $-1\\r\\n when client sends GET key that does not exist", async () => {
    const data = await sendInput(
      "*2\r\n$3\r\nGET\r\n$3\r\nkey\r\n",
      server
    );

    expect(data.toString()).toBe(
      toBulkString(null)
    );
  });

  it("should respond with $5\\r\\nvalue\\r\\n when client sends GET key that exists", async () => {
    const data = await sendInput(
      "*3\r\n$3\r\nSET\r\n$3\r\nkey\r\n$5\r\nvalue\r\n",
      server
    );

    expect(data.toString()).toBe(
      toSimpleString("OK")
    );

    const data2 = await sendInput(
      "*2\r\n$3\r\nGET\r\n$3\r\nkey\r\n",
      server
    );

    expect(data2.toString()).toBe(
      toBulkString("value")
    );
  });
});
