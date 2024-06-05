class Replication {
  role: string;

  constructor({ role }: { role: string }) {
    this.role = role;
  }

  toInfoStrArr() {
    const fields: string[] = [];

    for (const key in this) {
      if (this.hasOwnProperty(key)) {
        fields.push(
          `${key}:${this[key as keyof this]}`
        );
      }
    }

    return `${fields.join("\n")}`;
  }
}

export class RedisServerInfo {
  replication: Replication;

  constructor() {
    this.replication = new Replication({
      role: "master",
    });
  }

  getReplicationInfo() {
    return this.replication.toInfoStrArr();
  }
}
