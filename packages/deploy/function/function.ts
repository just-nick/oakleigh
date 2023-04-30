import { asset } from "@pulumi/pulumi";
import { iam, lambda } from "@pulumi/aws";
import { functionEndpointName, OakleighFunctionEndpoint } from "../common/oakleigh-component";

export function createLambdaFunction(component: OakleighFunctionEndpoint) {
  if (!component.details.compiledPath) {
    throw `Could not find compiled assets for '${component.details.exportName}'`;
  }

  const lambdaRole = new iam.Role(
    functionEndpointName(component, "lambdaRole"),
    {
      assumeRolePolicy: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "sts:AssumeRole",
            Principal: {
              Service: "lambda.amazonaws.com",
            },
            Effect: "Allow",
            Sid: "",
          },
        ],
      },
    }
  );

  const lambdaRoleAttachment = new iam.RolePolicyAttachment(
    functionEndpointName(component, "lambdaRoleAttachment"),
    {
      role: lambdaRole,
      policyArn: iam.ManagedPolicy.AWSLambdaBasicExecutionRole,
    }
  );

  const appContents = new asset.FileArchive(component.details.compiledPath);

  const lambdaFunction = new lambda.Function(
    functionEndpointName(component, "lambdaFunction"),
    {
      code: new asset.AssetArchive({ ".": appContents }),
      runtime: "nodejs14.x",
      role: lambdaRole.arn,
      handler: `${component.details.handlerName}.${component.details.exportName}`,
    }
  );

  return { lambdaFunction, lambdaRole, lambdaRoleAttachment };
}
