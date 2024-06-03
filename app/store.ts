interface IExpiringValue {
  value: string;
  expire: Date | null;
}

export class Store {
  private store: Map<string, IExpiringValue>;

  constructor() {
    this.store = new Map();
  }

  set(
    key: string,
    value: string,
    expire: Date | null = null
  ) {
    this.store.set(key, {
      value,
      expire,
    });
  }

  delete(key: string) {
    this.store.delete(key);
  }

  get(key: string) {
    const expiringValue = this.store.get(key);

    // 키가 존재하지 않는 경우 null 반환
    if (!expiringValue) {
      return null;
    }

    // 만료된 값은 삭제하고 null 반환
    if (
      expiringValue.expire &&
      expiringValue.expire < new Date()
    ) {
      this.store.delete(key);
      return null;
    }

    return expiringValue.value;
  }

  size() {
    return this.store.size;
  }
}
