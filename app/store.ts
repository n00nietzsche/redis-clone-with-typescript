export class Store {
  private store: Map<string, string>;

  constructor() {
    this.store = new Map();
  }

  set(key: string, value: string) {
    this.store.set(key, value);
  }

  get(key: string) {
    return this.store.get(key);
  }

  size() {
    return this.store.size;
  }
}
