import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

export function createApiFunctionTrigger(lambdaFunction: aws.lambda.Function) {
  const stack = pulumi.getStack();

  const apigw = new aws.apigatewayv2.Api("httpApiGateway", {
    protocolType: "HTTP",
  });

  const lambdaPermission = new aws.lambda.Permission(
    "lambdaPermission",
    {
      action: "lambda:InvokeFunction",
      principal: "apigateway.amazonaws.com",
      function: lambdaFunction,
      sourceArn: pulumi.interpolate`${apigw.executionArn}/*/*`,
    },
    { dependsOn: [apigw, lambdaFunction] }
  );

  const integration = new aws.apigatewayv2.Integration("lambdaIntegration", {
    apiId: apigw.id,
    integrationType: "AWS_PROXY",
    integrationUri: lambdaFunction.arn,
    integrationMethod: "POST",
    payloadFormatVersion: "2.0",
    passthroughBehavior: "WHEN_NO_MATCH",
  });

  const route = new aws.apigatewayv2.Route("apiRoute", {
    apiId: apigw.id,
    routeKey: "$default",
    target: pulumi.interpolate`integrations/${integration.id}`,
  });

  const stage = new aws.apigatewayv2.Stage(
    "apiStage",
    {
      apiId: apigw.id,
      name: stack,
      routeSettings: [
        {
          routeKey: route.routeKey,
          throttlingBurstLimit: 5000,
          throttlingRateLimit: 10000,
        },
      ],
      autoDeploy: true,
    },
    { dependsOn: [route] }
  );

  return {
      url: pulumi.interpolate`${apigw.apiEndpoint}/${stage.name}`
  }

  // const endpoint = pulumi.interpolate`${apigw.apiEndpoint}/${stage.name}`;
}
