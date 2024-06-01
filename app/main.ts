import * as net from "net";
import { parseClientCommand } from "./parser";
import { CommandExecutor } from "./command-executor";
import { Store } from "./store";

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log(
  "Logs from your program will appear here!"
);

const store = new Store();

// Uncomment this block to pass the first stage
const server: net.Server = net.createServer(
  (connection: net.Socket) => {
    const commandExecutor = new CommandExecutor(
      connection,
      store
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

server.listen(6379, "127.0.0.1");
