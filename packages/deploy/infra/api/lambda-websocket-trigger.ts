import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import {
  OakleighFunctionWebsocket,
  functionEndpointName,
} from "../function/function-endpoint";
import { Api } from "@pulumi/aws/apigatewayv2";

export function createWebsocketFunctionTrigger(
  apigw: Api,
  lambdaFunction: aws.lambda.Function,
  component: OakleighFunctionWebsocket
) {
  const lambdaPermission = new aws.lambda.Permission(
    functionEndpointName(component, "lambdaPermission"),
    {
      action: "lambda:InvokeFunction",
      principal: "apigateway.amazonaws.com",
      function: lambdaFunction,
      sourceArn: pulumi.interpolate`${apigw.executionArn}/*/*`,
    },
    { dependsOn: [apigw, lambdaFunction] }
  );

  const integration = new aws.apigatewayv2.Integration(
    functionEndpointName(component, "lambdaIntegration"),
    {
      apiId: apigw.id,
      integrationType: "AWS_PROXY",
      integrationUri: lambdaFunction.arn,
    }
  );

  const route = new aws.apigatewayv2.Route(
    functionEndpointName(component, "apiRoute"),
    {
      apiId: apigw.id,
      routeKey: component.details.path,
      target: pulumi.interpolate`integrations/${integration.id}`,
    }
  );

  return { route };

  // const endpoint = pulumi.interpolate`${apigw.apiEndpoint}/${stage.name}`;
}
