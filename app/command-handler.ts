import {
  toBulkString,
  toSimpleError,
  toSimpleString,
} from "./parser";
import { Store } from "./store";

export class CommandHandler {
  store: Store;

  constructor(store: Store) {
    this.store = store;
  }

  handleCommand(command: string, args: string[]) {
    command = command.toUpperCase();
    args = args.map((arg) => arg.toUpperCase());

    let response: string;

    switch (command) {
      case "ECHO":
        response = this.echo(args);
        break;
      case "PING":
        response = this.ping();
        break;
      case "SET":
        response = this.set(args);
        break;
      case "GET":
        response = this.get(args);
        break;
      default:
        throw new Error("Invalid command");
    }

    return response;
  }

  set(args: string[]) {
    this.assertArgsLengthMin("SET", args, 2);
    const [key, value, ...options] = args;

    if (options.includes("PX")) {
      const ttl = parseInt(
        options[options.indexOf("PX") + 1]
      );

      this.store.set(
        key,
        value,
        new Date(Date.now() + ttl)
      );

      return toSimpleString("OK");
    }

    this.store.set(key, value);
    return toSimpleString("OK");
  }

  get(args: string[]) {
    this.assertArgsLength("GET", args, 1);

    const value = this.store.get(args[0]);

    if (!value) {
      return toBulkString(null);
    } else {
      return toBulkString(value);
    }
  }

  echo(args: string[]) {
    this.assertArgsLength("ECHO", args, 1);
    return toSimpleString(args[0]);
  }

  ping() {
    return toSimpleString("PONG");
  }

  private assertArgsLength(
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

  private assertArgsLengthMin(
    command: string,
    args: string[],
    minLength: number
  ) {
    if (args.length < minLength) {
      throw new Error(
        `인자가 너무 적습니다. ${command} 명령어는 최소 ${minLength}개의 인자가 필요합니다.`
      );
    }
  }

  private writeError(error: string) {
    return toSimpleError(error);
  }
}
