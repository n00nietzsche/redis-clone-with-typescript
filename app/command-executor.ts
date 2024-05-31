import { Socket } from "net";
import { toSimpleString } from "./parser";

export class CommandExecutor {
  connection: Socket;

  constructor(connection: Socket) {
    this.connection = connection;
  }

  executeCommand(
    command: string,
    args: string[]
  ) {
    switch (command) {
      case "ECHO":
        this.echo(args);
        break;
      case "PING":
        this.ping();
        break;
      default:
        throw new Error(
          "유효하지 않은 명령어입니다."
        );
    }
  }

  ping() {
    this.writeResponse("PONG");
  }

  echo(args: string[]) {
    if (args.length === 0) {
      throw new Error("인자가 1개 필요합니다.");
    }

    if (args.length > 1) {
      throw new Error(
        "인자가 너무 많습니다. 1개만 입력해주세요."
      );
    }

    this.writeResponse(args[0]);
  }

  writeResponse(response: string) {
    this.connection.write(
      toSimpleString(response)
    );
  }
}
