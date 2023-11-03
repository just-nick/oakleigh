import { Unpack } from "./dynamo-common";

/**
 * @oakleigh document
 * @table WebsocketTopic
 * @hashKey pk S
 * @sortKey connectionId S
 */
export class WebSocketTopic {
  public static tableName: string = "WebsocketTopic";

  public static unpack: Unpack<WebSocketTopic> = (item) => ({
    pk: item.pk.S,
    connectionId: item.connectionId.S,
  });

  public pk?: string;
  public connectionId?: string;
}
