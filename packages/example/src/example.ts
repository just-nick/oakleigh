import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";

/**
 * Something useful
 * @oakleigh endpoint
 * @path /hello
 */
export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  return {
    statusCode: 200,
    body: "Hello World",
  };
};
