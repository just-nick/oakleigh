import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import { functionEndpointName, OakleighFunctionEndpoint } from "../common/oakleigh-component";

export function createApiFunctionTrigger(
  apigw: any,
  lambdaFunction: aws.lambda.Function,
  component: OakleighFunctionEndpoint
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
      integrationMethod: "POST",
      payloadFormatVersion: "2.0",
      passthroughBehavior: "WHEN_NO_MATCH",
    }
  );

  const routeKey = `${component.details.method || "GET"} /${
    component.details.path
  }`;
  console.log(routeKey);
  const route = new aws.apigatewayv2.Route(
    functionEndpointName(component, "apiRoute"),
    {
      apiId: apigw.id,
      routeKey,
      target: pulumi.interpolate`integrations/${integration.id}`,
    }
  );

  return { route, routeKey };

  // const endpoint = pulumi.interpolate`${apigw.apiEndpoint}/${stage.name}`;
}
