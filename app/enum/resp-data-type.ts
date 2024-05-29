export enum RedisRESPDataType {
  SimpleString = "+",
  SimpleError = "-",
  Integer = ":",
  BulkString = "$",
  Array = "*",
  Null = "_", // RESP3
  Boolean = "#", // RESP3
  Double = ",", // RESP3
  BigNumber = "(", // RESP3
  BulkError = "!", // RESP3
  VerbatimString = "=", // RESP3
  Map = "%", // RESP3
  Set = "~", // RESP3
  Push = ">", // RESP3
  Attribute = "|", // RESP3
}
