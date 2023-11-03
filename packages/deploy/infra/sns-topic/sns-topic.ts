import * as aws from "@pulumi/aws";
import { OakleighFunctionConsumer } from "../function/function-endpoint";

const topics: Record<string, aws.sns.Topic> = {};
export function createSnsTopic(component: OakleighFunctionConsumer) {
  const name = component.details.snsTopic;
  if (!topics[name]) {
    topics[name] = new aws.sns.Topic(component.details.snsTopic);
  }

  return { topic: topics[name] };
}
