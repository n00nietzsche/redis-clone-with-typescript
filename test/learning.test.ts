import { describe, expect, it } from "vitest";
import { RedisServerInfo } from "../app/server-info";

describe("Learning test", () => {
  it("the length increases by 1 for each blank space", () => {
    const zeroSpace =
      "ECHOECHOECHOECHOEHCOEHCOEHOCHOE";
    const split1 = zeroSpace.split(" ");
    expect(split1.length).toBe(1);

    const oneSpace = "ECHO hey";
    const split2 = oneSpace.split(" ");
    expect(split2.length).toBe(2);
  });

  it("First one be command and second one be argument", () => {
    const input = "ECHO hey";
    const [command, arg] = input.split(" ");
    expect(command).toBe("ECHO");
    expect(arg).toBe("hey");
  });

  it("현재 시간을 밀리초로 구하는 방법", () => {
    // Date.now() 는 현재 시간을 밀리초로 반환, 생성자의 정적 메서드
    const now = Date.now();
    expect(now).toBe(new Date().getTime());

    // new Date().getTime() 도 현재 시간을 밀리초로 반환 2
    const now2 = new Date().getTime();
    expect(now2).toBe(Date.now());
  });

  it("클래스의 필드를 순회", () => {
    const serverInfo = new RedisServerInfo();

    for (const key in serverInfo) {
      console.log(key);
      console.log(serverInfo[key]);
      console.log(
        serverInfo.getReplicationInfo()
      );
    }
  });
});
