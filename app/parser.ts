import { TERMINATOR } from "./const/const";
import {
  RedisRESPDataType,
  RedisRESPDataType as type,
} from "./enum/resp-data-type";

export interface IParseResult {
  type: RedisRESPDataType;
  value: string;
}

export function splitByTerminator(
  input: string
): string[] {
  return input.split(TERMINATOR).filter(Boolean);
}

export function parseBulkString(
  input: string
): IParseResult {
  const [lengthInput, stringInput] =
    splitByTerminator(input);

  const length = +lengthInput.replace(
    type.BulkString,
    ""
  );

  if (
    isNaN(length) ||
    length < 0 ||
    length !== stringInput.length
  ) {
    throw new Error("Invalid input");
  }

  return {
    type: type.BulkString,
    value: stringInput,
  };
}

/**
 * RESP Array 를 파싱하는 함수
 * @param input 프로토콜에 맞는 RESP Array 문자열
 * @returns {IParseResult[]} 타입과 값을 가진 오브젝트의 배열
 */
export function parseArray(input: string) {
  const splitInput = splitByTerminator(input);
  const length = +splitInput[0].replace(
    type.Array,
    ""
  );

  if (isNaN(length) || length < 0) {
    throw new Error("Invalid input");
  }

  const result: IParseResult[] = [];

  if (length === 0) {
    // empty array
    return result;
  }

  let index = 1; // Array 에 대한 포인터 역할
  let completed = 0; // 완료된 Element 의 갯수

  while (completed < length) {
    let parseResult: IParseResult;
    const sign = splitInput[index][0];

    switch (sign) {
      case type.BulkString:
        parseResult = parseBulkString(
          [
            splitInput[index],
            splitInput[index + 1],
          ]
            .map((e) => e + TERMINATOR)
            .join("")
        );

        index++;
        break;
      default:
        throw new Error("Invalid input");
    }

    result.push(parseResult);

    index++;
    completed++;
  }

  console.log("result", result);

  return result;
}

/**
 * Redis Client 에게 받은 Command 를 파싱하는 함수
 * Command 는 RESP Array 로 들어온다
 * 첫번째 Element 는 Command 이고 나머지는 Argument 이다
 * @param input 프로토콜에 맞는 RESP Array 문자열
 * @returns {command: string, args: string[]} Command 와 Argument 를 가진 오브젝트
 */
export function parseClientCommand(
  input: string
): {
  command: string;
  args: string[];
} {
  const [command, ...args] = parseArray(input);

  return {
    command: command.value,
    args: args.map((e) => e.value),
  };
}
