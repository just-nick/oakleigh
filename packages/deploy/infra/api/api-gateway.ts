import * as aws from "@pulumi/aws";
import { Api } from "@pulumi/aws/apigatewayv2";

let apigw: Api;
export function createApiGateway() {
  if (!apigw) {
    apigw = new aws.apigatewayv2.Api("httpApiGateway", {
      protocolType: "HTTP",
    });
  }

  return apigw;
}