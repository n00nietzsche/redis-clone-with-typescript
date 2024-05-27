import { once } from "events";
import * as net from "net";
import { describe, expect, it } from "vitest";

describe("Redis server", () => {
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
});
