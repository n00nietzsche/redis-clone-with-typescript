import { describe, expect, it } from "vitest";
import { RedisServerInfo } from "../app/server-info";

describe("RedisServerInfo 클래스의", () => {
  // given
  const serverInfo = new RedisServerInfo({
    replicationParams: {
      role: "master",
      master_replid:
        "8371b4fb1155b71f4a04d3e1bc3e18c4a990aeeb",
      master_repl_offset: 0,
    },
    serverParams: {
      port: 1111,
    },
  });

  it("getReplicationInfo() 메서드는 필드명:값(줄넘김) 의 형태로 Replication 정보를 출력한다.", () => {
    // when
    const result =
      serverInfo.getReplicationInfo();

    // then
    expect(result).toBe(
      "role:master\nmaster_replid:8371b4fb1155b71f4a04d3e1bc3e18c4a990aeeb\nmaster_repl_offset:0"
    );
  });
});
