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

// parse 에서 받든, parseArray 에서 받든 다 처리를 해줬으면 좋겠는데, 현재 상황에서는 parse 에선 Terminator 로 나눠져있지가 않고, parseArray 에서만 나눠져있음
// -> parseArray 에서 parseBulkString 으로 넘겨줄 때 다시 합쳐서 넘겨줬음
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

  // TODO: RESP Array 로 온 Element 들을 다시 한번 나눠주기
  // TODO: 다음 Element 의 Type 에 따라 어디까지가 해당 Element 인지 구분하기
  // TODO: Type 마다 매개변수를 몇개씩 받을 수 있는지 고려해야 함

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

export function parse(input: string): {
  command: string;
  args: string[];
} {
  switch (input[0]) {
    case type.Array:
      parseArray(input);
    default:
      throw new Error("Invalid input");
  }
}
