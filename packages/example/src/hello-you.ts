import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";

/**
 * Something useful
 * @oakleigh endpoint
 * @path hello/{name}
 */
export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  const name = event.pathParameters?.name;
  return {
    statusCode: 200,
    body: `Hello ${name}`,
  };
};
