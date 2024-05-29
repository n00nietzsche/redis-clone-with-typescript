import { RedisRESPDataType } from "../enum/resp-data-type";

export const TERMINATOR = "\r\n";
export const RESP_DATA_TYPES = Object.values(
  RedisRESPDataType
);
