import { describe, expect, it } from "vitest";
import {
  getOptionArr,
  getPort,
  getReplicaOf,
} from "../app/utils";

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

  describe("getPort() 함수는", () => {
    it("배열에 '--port' 옵션과 유효한 포트 번호가 주어지면, 그 포트 번호를 정수로 반환한다.", () => {
      const args = [
        "/Users/jakeseo/.bun/bin/bun",
        "/Users/jakeseo/Desktop/study/codecrafters-redis-typescript/app/main.ts",
        "--port",
        "8080",
      ];

      const result = getPort(args);
      expect(result).toEqual(8080);
    });

    it("배열에 '--port' 옵션이 없으면, 기본 포트 번호인 6379를 반환한다.", () => {
      const args = [
        "/Users/jakeseo/.bun/bin/bun",
        "/Users/jakeseo/Desktop/study/codecrafters-redis-typescript/app/main.ts",
      ];

      const result = getPort(args);
      expect(result).toEqual(6379);
    });
  });

  describe("getReplicaOf() 함수는", () => {
    it("배열에 '--replicaof' 옵션과 유효한 호스트와 포트가 주어지면, 그 호스트와 포트를 객체로 반환한다.", () => {
      const args = [
        "/Users/jakeseo/.bun/bin/bun",
        "/Users/jakeseo/Desktop/study/codecrafters-redis-typescript/app/main.ts",
        "--replicaof",
        "localhost 8080",
      ];

      const result = getReplicaOf(args);
      expect(result).toEqual({
        host: "localhost",
        port: "8080",
      });
    });

    it("배열에 '--replicaof' 옵션이 없으면, null을 반환한다.", () => {
      const args = [
        "/Users/jakeseo/.bun/bin/bun",
        "/Users/jakeseo/Desktop/study/codecrafters-redis-typescript/app/main.ts",
      ];

      const result = getReplicaOf(args);
      expect(result).toBeNull();
    });
  });
});
