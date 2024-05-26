import * as net from "net";
import { describe, expect, it } from "vitest";

describe("Redis server", () => {
  it("should respond with +PONG\\r\\n when client sends PING\\r\\n", () => {
    const client = net.createConnection(
      { port: 6379, host: "127.0.0.1" },
      () => {
        client.write("PING\r\n");
      }
    );

    client.on("data", (data: Buffer) => {
      expect(data.toString()).toBe("+PONG\r\n");
      client.end();
    });
  });
});
