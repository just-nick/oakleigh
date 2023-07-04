import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import { Api, Route } from "@pulumi/aws/apigatewayv2";

export function createApiStage(apigw: Api, routes: Route[]) {
  const stack = pulumi.getStack();
  const stage = new aws.apigatewayv2.Stage(
    "apiStage",
    {
      apiId: apigw.id,
      name: stack,
      routeSettings: routes.map((r) => ({
        routeKey: r.routeKey,
        throttlingBurstLimit: 5000,
        throttlingRateLimit: 10000,
      })),
      autoDeploy: true,
    },
    { dependsOn: routes }
  );

  return {
    stage,
    outputs: {
      url: pulumi.interpolate`${apigw.apiEndpoint}/${stage.name}`,
      routes: routes.map((route) => route.routeKey),
    },
  };
}
