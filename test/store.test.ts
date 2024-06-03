import {
  beforeEach,
  describe,
  expect,
  it,
} from "vitest";
import { Store } from "../app/store";

describe("Store 클래스의", () => {
  let store: Store;

  beforeEach(() => {
    store = new Store();
  });

  describe("set() 메서드는", () => {
    it("key, value 와 함께 데이터 만료 기한을 받아 저장한다.", () => {
      const key = "key";
      const value = "value";
      const expire = new Date();

      store.set(key, value, expire);

      expect(store.get(key)).toEqual(value);
    });
  });

  describe("get() 메서드는", () => {
    it("store 에 존재하지 않는 key 를 통해 값을 불러온다면, null 을 반환한다.", () => {
      const result = store.get("non-exist-key");

      expect(result).toBeNull();
    });

    it("store 에 존재하는 key 를 통해 불러온 값이 만료기한 전이라면, 정상적으로 값을 반환한다.", () => {
      store.set(
        "key",
        "value",
        new Date(Date.now() + 1000) // 1초 후 만료
      );

      const result = store.get("key");

      expect(result).toEqual("value");
    });

    it("store 에 존재하는 key 를 통해 불러온 값이 만료기한 후라면, store 에서 key, value 를 삭제하고 null 을 반환한다.", () => {
      store.set(
        "key",
        "value",
        new Date(Date.now() - 1000) // 1초 전 만료
      );

      // 만료된 키 1개 존재
      expect(store.size()).toBe(1);

      const result = store.get("key");

      expect(result).toBeNull();

      // 만료된 키 삭제되었는지 검증
      expect(store.size()).toBe(0);
    });
  });
});
