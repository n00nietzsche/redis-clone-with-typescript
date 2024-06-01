import { Socket } from "net";
import {
  toBulkString,
  toSimpleError,
  toSimpleString,
} from "./parser";
import { Store } from "./store";

export class CommandExecutor {
  connection: Socket;
  store: Store;

  constructor(connection: Socket, store: Store) {
    this.connection = connection;
    this.store = store;
  }

  executeCommand(
    command: string,
    args: string[]
  ) {
    command = command.toUpperCase();

    switch (command) {
      case "ECHO":
        this.echo(args);
        break;
      case "PING":
        this.ping();
        break;
      case "SET":
        this.set(args);
        break;
      case "GET":
        this.get(args);
        break;
      default:
        throw new Error(
          "유효하지 않은 명령어입니다."
        );
    }
  }

  set(args: string[]) {
    this.assertArgsLength("SET", args, 2);

    this.store.set(args[0], args[1]);
    this.writeResponse(toSimpleString("OK"));
  }

  get(args: string[]) {
    this.assertArgsLength("GET", args, 1);

    const value = this.store.get(args[0]);

    if (value === undefined) {
      this.writeResponse(toBulkString(null));
    } else {
      this.writeResponse(toBulkString(value));
    }
  }

  echo(args: string[]) {
    this.assertArgsLength("ECHO", args, 1);
    this.writeResponse(toSimpleString(args[0]));
  }

  ping() {
    this.writeResponse(toSimpleString("PONG"));
  }

  writeResponse(response: string) {
    this.connection.write(response);
  }

  writeError(error: string) {
    this.writeResponse(toSimpleError(error));
  }

  assertArgsLength(
    command: string,
    args: string[],
    length: number
  ) {
    if (args.length > length) {
      throw new Error(
        `인자가 너무 많습니다. ${command} 명령어는 인자가 ${length}개 필요합니다.`
      );
    }

    if (args.length < length) {
      throw new Error(
        `인자가 너무 적습니다. ${command} 명령어는 인자가 ${length}개 필요합니다.`
      );
    }
  }
}
