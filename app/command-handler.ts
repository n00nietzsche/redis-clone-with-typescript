import {
  toBulkString,
  toSimpleError,
  toSimpleString,
} from "./parser";
import { RedisServerInfo } from "./server-info";
import { Store } from "./store";
import { caseInsensitiveEqual } from "./utils";

export class CommandHandler {
  store: Store;
  serverInfo: RedisServerInfo;

  constructor(
    store: Store,
    serverInfo: RedisServerInfo
  ) {
    this.store = store;
    this.serverInfo = serverInfo;
  }

  handleCommand(command: string, args: string[]) {
    command = command.toUpperCase();

    // SET 명령어의 경우, 옵션에 대한 대소문자 구분 무시를 위해 옵션은 미리 대문자로 변환하여 통일시켜줌
    if (command === "SET") {
      args = args.map((arg, index) => {
        // 첫번째, 두번째는 키, 값이므로 대문자로 변환하지 않음
        if (index <= 1) {
          return arg;
        }

        return arg.toUpperCase();
      });
    }

    let response: string;

    switch (command) {
      case "ECHO":
        response = this.echo(args);
        break;
      case "GET":
        response = this.get(args);
        break;
      case "INFO":
        response = this.info(args);
        break;
      case "PING":
        response = this.ping();
        break;
      case "SET":
        response = this.set(args);
        break;
      default:
        throw new Error("Invalid command");
    }

    return response;
  }

  info(args: string[]) {
    this.assertArgsLength("INFO", args, 1);

    if (
      args[0] &&
      caseInsensitiveEqual(args[0], "REPLICATION")
    ) {
      return toBulkString(
        this.serverInfo.getReplicationInfo()
      );
    }

    return toBulkString(null);
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
