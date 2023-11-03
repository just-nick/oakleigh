import { SNSEvent } from "aws-lambda";
import { ApiGatewayManagementApi } from "aws-sdk";
import { byPk } from "./dynamo-common";
import { WebSocketTopic } from "./web-socket-topic";
import { OPEN_TOPIC } from "./constants";

/**
 * Something useful
 * @oakleigh consumer
 * @snsTopic chat-message
 */
export const handler = async (event: SNSEvent): Promise<void> => {
  const endpoint = process.env.OAKLEIGH_WEBSOCKET_GATEWAY;
  const message = event.Records[0].Sns.Message;

  const apigwManagementApi = new ApiGatewayManagementApi({
    apiVersion: "2018-11-29",
    endpoint,
  });

  const connections = await byPk(
    WebSocketTopic.tableName,
    OPEN_TOPIC,
    WebSocketTopic.unpack
  );

  connections?
  .map(connection => connection.connectionId)
  .filter(c => c)
  .map(connection => apigwManagementApi
    .postToConnection({
      ConnectionId: connection.connectionId,
      Data: message,
    })
    .promise())
  if (connections) {
    for (const connection of connections) {
      if (connection.connectionId) {
        await ;
      }
    }
  }
};

/*
{
  "Records": [
    {
      "Sns": {
        "Message": "Hello world"
      }
    }
  ]
}
*/
