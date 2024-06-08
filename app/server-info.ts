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
  master_replid: string;
  master_repl_offset: number;
}
class Replication {
  role: string;
  master_replid: string;
  master_repl_offset: number;

  constructor({
    role,
    master_replid,
    master_repl_offset,
  }: IReplicationConstructorParams) {
    this.role = role;
    this.master_replid = master_replid;
    this.master_repl_offset = master_repl_offset;
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
