import * as net from "net";
import { argv } from "process";
import { parseClientCommand } from "./parser";
import { CommandExecutor } from "./command-executor";
import { Store } from "./store";
import { CommandHandler } from "./command-handler";
import { getPort, getReplicaOf } from "./utils";
import { RedisServerInfo } from "./server-info";

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log(
  "Logs from your program will appear here!"
);

export function getRedisServer(
  store: Store,
  serverInfo: RedisServerInfo
) {
  const server = net.createServer(
    (connection: net.Socket) => {
      const commandHandler = new CommandHandler(
        store,
        serverInfo
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

const port = getPort(argv);
const replica = getReplicaOf(argv);

const redisServerInfo = new RedisServerInfo({
  replicationParams: {
    role: replica ? "slave" : "master",
    master_replid:
      "8371b4fb1155b71f4a04d3e1bc3e18c4a990aeeb",
    master_repl_offset: 0,
  },
  serverParams: {
    port,
  },
});

// Uncomment this block to pass the first stage
const server: net.Server = getRedisServer(
  new Store(),
  redisServerInfo
);

server.listen(port, "127.0.0.1");
