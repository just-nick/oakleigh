import { Route } from "@pulumi/aws/apigatewayv2";
import { Output } from "@pulumi/pulumi";
import { createApiGateway } from "./api/api-gateway";
import { createApiStage } from "./api/api-stage";
import { createApiFunctionTrigger } from "./api/lambda-trigger";
import { createPublicBucket } from "./bucket/public-bucket";
import {
  OakleighComponentSet,
  OakleighFunctionEndpoint,
} from "./common/oakleigh-component";
import { createLambdaFunction } from "./function/function";

export const buildProgram = (handlers: OakleighComponentSet) => async () => {
  // const siteBucket = createPublicBucket("s3-website-bucket");
  // const set: Record<string, any> = {};
  const routes: Route[] = [];
  const outputs: Record<string, any> = {};

  for (const [key, component] of Object.entries(handlers)) {
    switch (component.type) {
      case "endpoint": {
        const endpoint = buildEndpoint(component);
        routes.push(endpoint.route);
      }
    }
  }

  if (routes.length > 0) {
    const apigw = createApiGateway();
    const stage = createApiStage(apigw, routes);
    for (const [outputName, outputValue] of Object.entries(stage.outputs)) {
      outputs[`api_${outputName}`] = outputValue;
    }
  }

  return outputs;
};

function buildEndpoint(component: OakleighFunctionEndpoint) {
  const lambdaFunction = createLambdaFunction(component);

  const apigw = createApiGateway();
  const apiTrigger = createApiFunctionTrigger(
    apigw,
    lambdaFunction.lambdaFunction,
    component
  );

  return { ...lambdaFunction, ...apiTrigger };
}
