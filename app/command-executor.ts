import { Socket } from "net";
import { CommandHandler } from "./command-handler";

export class CommandExecutor {
  connection: Socket;
  commandHandler: CommandHandler;

  constructor(
    connection: Socket,
    commandHandler: CommandHandler
  ) {
    this.connection = connection;
    this.commandHandler = commandHandler;
  }

  executeCommand(
    command: string,
    args: string[]
  ) {
    command = command.toUpperCase();
    let response =
      this.commandHandler.handleCommand(
        command,
        args
      );

    return this.writeResponse(response);
  }

  writeResponse(response: string) {
    this.connection.write(response);
  }
}
