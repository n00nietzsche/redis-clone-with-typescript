import { RedisRESPDataType as type } from "./enum/resp-data-type";

export function split(input: string): string[] {
  return input
    .split("\r\n")
    .filter((line) => line !== "");
}

export function parse(input: string): {
  command: string;
  args: string[];
} {
  switch (input[0]) {
    case type.Array:
      return parseArray(input);
    default:
      throw new Error("Invalid input");
  }
}

function parseArray(input: string) {
  const splited = split(input);
  const length = +splited[0].replace("*", "");

  const command = splited[2];
  const args: string[] = [];

  for (let i = 1; i < length; i++) {
    args.push(splited[2 + i * 2]);
  }

  return {
    command,
    args,
  };
}
