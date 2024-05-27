// *3\r\n$4\r\nECHO\r\n$3\r\nhey\r\n$8\r\nasdfasdf\r\n

export function split(input: string): string[] {
  return input
    .split("\r\n")
    .filter((line) => line !== "");
}

export function parse(input: string): {
  command: string;
  args: string[];
} {
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
