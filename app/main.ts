import * as net from "net";
import { parse } from "./parser";

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log(
  "Logs from your program will appear here!"
);

// Uncomment this block to pass the first stage
const server: net.Server = net.createServer(
  (connection: net.Socket) => {
    // Handle connection
    connection.on("data", (data: Buffer) => {
      console.log(
        "Recieved: ",
        JSON.stringify(data.toString())
      );

      const { command, args } = parse(
        data.toString()
      );

      if (command === "ECHO") {
        if (args.length === 0) {
          connection.write("+\r\n");
          return;
        }

        connection.write(`+${args[0]}\r\n`);
      }

      if (command === "PING") {
        connection.write("+PONG\r\n");
      }
    });
  }
);

server.listen(6379, "127.0.0.1");
