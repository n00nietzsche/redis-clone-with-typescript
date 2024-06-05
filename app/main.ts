import * as net from "net";
import { argv } from "process";
import { parseClientCommand } from "./parser";
import { CommandExecutor } from "./command-executor";
import { Store } from "./store";
import { CommandHandler } from "./command-handler";
import { getPort } from "./utils";

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log(
  "Logs from your program will appear here!"
);

export function getRedisServer(store: Store) {
  const server = net.createServer(
    (connection: net.Socket) => {
      const commandHandler = new CommandHandler(
        store
      );

      const commandExecutor = new CommandExecutor(
        connection,
        commandHandler
      );

      // Handle connection
      connection.on("data", (data: Buffer) => {
        console.log(
          "Recieved: ",
          JSON.stringify(data.toString())
        );

        const { command, args } =
          parseClientCommand(data.toString());

        commandExecutor.executeCommand(
          command,
          args
        );
      });
    }
  );

  return server;
}

// Uncomment this block to pass the first stage
const server: net.Server = getRedisServer(
  new Store()
);

const port = getPort(argv);

server.listen(port, "127.0.0.1");
