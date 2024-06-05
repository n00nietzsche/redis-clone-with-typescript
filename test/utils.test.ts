import { describe, expect, it } from "vitest";
import { getOptionArr } from "../app/utils";

describe("utils 내부의", () => {
  describe("getOptionArr() 함수는", () => {
    it("배열, 옵션 이름, 옵션 인자 길이를 받으면 배열에서 해당 옵션과 인자에 해당하는 부분을 잘라내 반환한다.", () => {
      const args = [
        "/Users/jakeseo/.bun/bin/bun",
        "/Users/jakeseo/Desktop/study/codecrafters-redis-typescript/app/main.ts",
        "--port",
        "3000",
      ];

      const result = getOptionArr(
        args,
        "--port",
        1
      );
      expect(result).toEqual(["--port", "3000"]);
    });

    it("배열에 존재하지 않는 옵션 이름을 받으면 null 을 반환한다.", () => {
      const args = [
        "/Users/jakeseo/.bun/bin/bun",
        "/Users/jakeseo/Desktop/study/codecrafters-redis-typescript/app/main.ts",
        "--port",
        "3000",
      ];

      const result = getOptionArr(
        args,
        "--host",
        1
      );
      expect(result).toBeNull();
    });

    it("배열이 짧아 옵션 인자 길이만큼 추출할 수 없다면 null 을 반환한다.", () => {
      const args = [
        "/Users/jakeseo/.bun/bin/bun",
        "/Users/jakeseo/Desktop/study/codecrafters-redis-typescript/app/main.ts",
        "--port",
        "3000",
      ];

      const result = getOptionArr(
        args,
        "--port",
        2
      );
      expect(result).toBeNull();
    });
  });
});
