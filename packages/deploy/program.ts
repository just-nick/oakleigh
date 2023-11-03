import { Api, Route } from "@pulumi/aws/apigatewayv2";
import { createGateway } from "./infra/api/api-gateway";
import { createApiStage } from "./infra/api/api-stage";
import { createApiFunctionTrigger } from "./infra/api/lambda-trigger";
import { OakleighInfraDescriptionSet } from "./infra/oakleigh-infra";
import {
  OakleighFunctionConsumer,
  OakleighFunctionEndpoint,
  OakleighFunctionWebsocket,
  createLambdaFunction,
} from "./infra/function/function-endpoint";
import { createSnSFunctionTrigger } from "./infra/sns-topic/sns-function-trigger";
import { createSnsTopic } from "./infra/sns-topic/sns-topic";
import { Input, Output, getStack, interpolate } from "@pulumi/pulumi";
import { camelize } from "./common/string.utils";
import { createWebsocketFunctionTrigger } from "./infra/api/lambda-websocket-trigger";
import {
  OakleighDocument,
  createDynamoDbDocument,
} from "./infra/document/dynamo-db-document";

export const buildProgram =
  (handlers: OakleighInfraDescriptionSet) => async () => {
    // const siteBucket = createPublicBucket("s3-website-bucket");
    // const set: Record<string, any> = {};
    const routes: Route[] = [];
    const finalOutputs: Record<string, any> = {};

    const stack = getStack();
    const { document } = createDynamoDbDocument();
    const gateway = createGateway();
    const environment: Record<string, Output<string>> = {
      OAKLEIGH_API_GATEWAY: interpolate`${gateway.apiGateway.apiEndpoint}/${stack}`,
      OAKLEIGH_WEBSOCKET_GATEWAY: interpolate`${gateway.websocketGateway.apiEndpoint}/${stack}`,
      OAKLEIGH_DYNAMO_DB: document.name,
    };

    const components = Object.entries(handlers);
    for (const [, component] of components) {
      if (component.type === "consumer") {
        const { topic } = createSnsTopic(component);
        const topicName = camelize(component.details.snsTopic);
        const key = `OAKLEIGH_TOPIC_ARN_${topicName}`;
        environment[key] = topic.arn;
      }
    }

    for (const [, component] of components) {
      switch (component.type) {
        case "endpoint": {
          const endpoint = buildEndpoint(
            component,
            gateway.apiGateway,
            environment
          );
          routes.push(endpoint.route);
          break;
        }
        case "websocket": {
          buildWebsocket(component, gateway.websocketGateway, environment);
          break;
        }
        case "consumer": {
          buildConsumer(component, environment);
          break;
        }
        case "document": {
          buildDocument(component);
          break;
        }
      }
    }

    if (routes.length > 0) {
      const { outputs } = createApiStage(gateway, routes);
      for (const [outputName, outputValue] of Object.entries(outputs)) {
        finalOutputs[`api_${outputName}`] = outputValue;
      }
    }

    if (Object.keys(environment).length > 0) {
      for (const [key, value] of Object.entries(environment)) {
        finalOutputs[`env_${key}`] = value;
      }
    }

    return finalOutputs;
  };

function buildDocument(component: OakleighDocument) {}

function buildEndpoint(
  component: OakleighFunctionEndpoint,
  apiGateway: Api,
  environment: Record<string, Input<string>>
) {
  const lambdaFunction = createLambdaFunction(component, environment);
  const apiTrigger = createApiFunctionTrigger(
    apiGateway,
    lambdaFunction.lambdaFunction,
    component
  );

  return { ...lambdaFunction, ...apiTrigger };
}

function buildConsumer(
  component: OakleighFunctionConsumer,
  environment: Record<string, Input<string>>
) {
  const { topic } = createSnsTopic(component);
  const { lambdaFunction } = createLambdaFunction(component, environment);

  const apiTrigger = createSnSFunctionTrigger(topic, lambdaFunction, component);

  return { ...lambdaFunction, ...apiTrigger };
}

function buildWebsocket(
  component: OakleighFunctionWebsocket,
  apiGateway: Api,
  environment: Record<string, Input<string>>
) {
  const lambdaFunction = createLambdaFunction(component, environment);
  const apiTrigger = createWebsocketFunctionTrigger(
    apiGateway,
    lambdaFunction.lambdaFunction,
    component
  );

  return { ...lambdaFunction, ...apiTrigger };
}
