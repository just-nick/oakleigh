import * as aws from "@pulumi/aws";
import {
  OakleighFunctionConsumer,
  functionEndpointName,
} from "../function/function-endpoint";

export function createSnSFunctionTrigger(
  topic: aws.sns.Topic,
  lambdaFunction: aws.lambda.Function,
  component: OakleighFunctionConsumer
) {
  const permission = new aws.lambda.Permission(
    functionEndpointName(component, "lambdaPermission"),
    {
      action: "lambda:InvokeFunction",
      principal: "sns.amazonaws.com",
      function: lambdaFunction,
      sourceArn: topic.arn,
    },
    { dependsOn: [topic, lambdaFunction] }
  );

  const subscription = new aws.sns.TopicSubscription(
    functionEndpointName(component, "subscription"),
    {
      protocol: "lambda",
      endpoint: lambdaFunction.arn,
      topic: topic.arn,
    }
  );

  return { permission, subscription };
}
