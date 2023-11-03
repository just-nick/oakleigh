import * as aws from "@pulumi/aws";
import { Api } from "@pulumi/aws/apigatewayv2";

let apiGateway: Api;
let websocketGateway: Api;
export function createGateway() {
  if (!apiGateway) {
    apiGateway = new aws.apigatewayv2.Api("httpApiGateway", {
      protocolType: "HTTP",
    });
  }

  if (!websocketGateway) {
    websocketGateway = new aws.apigatewayv2.Api("websocketApiGateway", {
      protocolType: "WEBSOCKET",
      routeSelectionExpression: "$request.body.message",
    });
  }

  return { apiGateway, websocketGateway };
}
