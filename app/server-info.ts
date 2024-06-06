interface IServerConstructorParams {
  port: number;
}
class Server {
  port: number;

  constructor({
    port,
  }: IServerConstructorParams) {
    this.port = port;
  }
}

interface IReplicationConstructorParams {
  role: string;
}
class Replication {
  role: string;

  constructor({
    role,
  }: IReplicationConstructorParams) {
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

interface IRedisServerInfoConstructorParams {
  replicationParams: IReplicationConstructorParams;
  serverParams: IServerConstructorParams;
}
export class RedisServerInfo {
  replication: Replication;
  server: Server;

  constructor({
    replicationParams,
    serverParams,
  }: IRedisServerInfoConstructorParams) {
    this.replication = new Replication(
      replicationParams
    );
    this.server = new Server(serverParams);
  }

  getReplicationInfo() {
    return this.replication.toInfoStrArr();
  }
}
