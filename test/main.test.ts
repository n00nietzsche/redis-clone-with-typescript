import { once } from "events";
import * as net from "net";
import { describe, expect, it } from "vitest";
import {
  toBulkString,
  toSimpleString,
} from "../app/parser";

describe("PING command", () => {
  it("should respond with +PONG\\r\\n when client sends PING\\r\\n", async () => {
    const client = net.createConnection(
      { port: 6379, host: "127.0.0.1" },
      () => {
        client.write("*1\r\n$4\r\nPING\r\n");
      }
    );

    const [data] = await once(client, "data");
    expect(data.toString()).toBe("+PONG\r\n");
    client.end();
  });
});

describe("ECHO command", () => {
  it("should respond with hey when client sends ECHO hey", async () => {
    const client = net.createConnection(
      { port: 6379, host: "127.0.0.1" },
      () => {
        client.write(
          "*2\r\n$4\r\nECHO\r\n$3\r\nhey\r\n"
        );
      }
    );

    const [data] = await once(client, "data");
    expect(data.toString()).toBe("+hey\r\n");
    client.end();
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
      const client = net.createConnection(
        { port: 6379, host: "127.0.0.1" },
        () => {
          client.write(
            `*2\r\n$4\r\nECHO\r\n$${testString.length}\r\n${testString}\r\n`
          );
        }
      );

      const [data] = await once(client, "data");
      expect(data.toString()).toBe(
        `+${testString}\r\n`
      );
      client.end();
    });
  });
});

describe("SET command", () => {
  it("should respond with +OK\\r\\n when client sends SET key value", async () => {
    const client = net.createConnection(
      { port: 6379, host: "127.0.0.1" },
      () => {
        client.write(
          "*3\r\n$3\r\nSET\r\n$3\r\nkey\r\n$5\r\nvalue\r\n"
        );
      }
    );

    const [data] = await once(client, "data");
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
      const client = net.createConnection(
        { port: 6379, host: "127.0.0.1" },
        () => {
          client.write(
            `*3\r\n$3\r\nSET\r\n$${key.length}\r\n${key}\r\n$${value.length}\r\n${value}\r\n`
          );
        }
      );

      const [data] = await once(client, "data");
      expect(data.toString()).toBe(
        toSimpleString("OK")
      );
    });
  });
});

describe("GET command", () => {
  it("should respond with $-1\\r\\n when client sends GET key that does not exist", async () => {
    const client = net.createConnection(
      { port: 6379, host: "127.0.0.1" },
      () => {
        client.write(
          "*2\r\n$3\r\nGET\r\n$3\r\nkey\r\n"
        );
      }
    );

    const [data] = await once(client, "data");
    expect(data.toString()).toBe(
      toBulkString(null)
    );
  });

  it("should respond with $5\\r\\nvalue\\r\\n when client sends GET key that exists", async () => {
    const client1 = net.createConnection(
      { port: 6379, host: "127.0.0.1" },
      () => {
        client1.write(
          "*3\r\n$3\r\nSET\r\n$3\r\nkey\r\n$5\r\nvalue\r\n"
        );
      }
    );

    const [data] = await once(client1, "data");
    expect(data.toString()).toBe(
      toSimpleString("OK")
    );

    const client2 = net.createConnection(
      { port: 6379, host: "127.0.0.1" },
      () => {
        client2.write(
          "*2\r\n$3\r\nGET\r\n$3\r\nkey\r\n"
        );
      }
    );

    const [data2] = await once(client2, "data");
    expect(data2.toString()).toBe(
      toBulkString("value")
    );
  });
});
