import { describe, expect, it } from "vitest";
import { RedisServerInfo } from "../app/server-info";

describe("RedisServerInfo 클래스의", () => {
  // given
  const serverInfo = new RedisServerInfo();

  it("getReplicationInfo() 메서드는 필드명:값(줄넘김) 의 형태로 Replication 정보를 출력한다.", () => {
    // when
    const result =
      serverInfo.getReplicationInfo();

    // then
    expect(result).toBe("role:master");
  });
});
