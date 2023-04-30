import { createApiFunctionTrigger } from "./api/lambda-trigger";
import { createPublicBucket } from "./bucket/public-bucket";
import { OakleighComponentSet } from "./common/oakleigh-component";
import { createLambdaFunction } from "./function/function";

export const buildProgram = (handlers: OakleighComponentSet) => async () => {
  const component = Object.values(handlers)[0];
  const lambdaFunction = createLambdaFunction(
    component.details.path,
    component.details.handlerName,
    component.details.exportName
  );
  const apiTrigger = createApiFunctionTrigger(lambdaFunction);
  // const siteBucket = createPublicBucket("s3-website-bucket");

  return {
    // websiteUrl: siteBucket.websiteURL,
    // bucketId: siteBucket.id,
    api: apiTrigger.url,
  };
};
