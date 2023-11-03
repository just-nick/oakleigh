import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { SNS } from "aws-sdk";

/**
 * @oakleigh endpoint
 * @path message
 */
export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  const TopicArn = process.env.OAKLEIGH_TOPIC_ARN_chatMessage;
  const sns = new SNS();
  sns
    .publish({
      Message: "Hello world",
      TopicArn,
    })
    .promise();

  return {
    statusCode: 201,
  };
};
