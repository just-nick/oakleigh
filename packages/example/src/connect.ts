import {
  APIGatewayProxyWebsocketEventV2,
  APIGatewayProxyResultV2,
} from "aws-lambda";
import { SNS } from "aws-sdk";
import { add, byPk } from "./dynamo-common";
import { WebSocketTopic } from "./web-socket-topic";
import { OPEN_TOPIC } from "./constants";

/**
 * @oakleigh websocket
 * @path $connect
 */
export const handler = async (
  event: APIGatewayProxyWebsocketEventV2
): Promise<APIGatewayProxyResultV2> => {
  await add<WebSocketTopic>(WebSocketTopic.tableName, OPEN_TOPIC, {
    connectionId: { S: event.requestContext.connectionId },
  });

  return {
    statusCode: 200,
  };
};
