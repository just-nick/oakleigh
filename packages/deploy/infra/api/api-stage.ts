import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import { Api, Route } from "@pulumi/aws/apigatewayv2";

export function createApiStage(
  gw: { apiGateway: Api; websocketGateway: Api },
  routes: Route[]
) {
  const stack = pulumi.getStack();
  const apiStage = new aws.apigatewayv2.Stage(
    "apiStage",
    {
      apiId: gw.apiGateway.id,
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
  const websocketStage = new aws.apigatewayv2.Stage("websocketStage", {
    apiId: gw.websocketGateway.id,
    name: stack,
    autoDeploy: true,
  });

  return {
    apiStage,
    websocketStage,
    outputs: {
      url: pulumi.interpolate`${gw.apiGateway.apiEndpoint}/${apiStage.name}`,
      websocket: websocketStage.invokeUrl,
      routes: routes.map((route) => route.routeKey),
    },
  };
}
