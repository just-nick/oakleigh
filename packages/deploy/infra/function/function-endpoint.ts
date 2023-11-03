import { Input, asset } from "@pulumi/pulumi";
import { dynamodb, iam, lambda } from "@pulumi/aws";
import { camelize } from "../../common/string.utils";
import { runtime } from "../../common/constants";

export type MethodType = (typeof MethodType)[keyof typeof MethodType];
export const MethodType = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
  PATCH: "PATCH",
} as const;
export function isMethodType(
  value: string | undefined | null
): value is MethodType {
  return (Object.values(MethodType) as any[]).includes(value);
}
export interface OakleighFunctionEndpoint {
  filename: string;
  type: "endpoint";
  details: {
    compiledPath?: string;
    path: string;
    method: MethodType;
    handlerName: string;
    exportName: string;
  };
}

export interface OakleighFunctionConsumer {
  filename: string;
  type: "consumer";
  details: {
    compiledPath?: string;
    snsTopic: string;
    handlerName: string;
    exportName: string;
  };
}

export interface OakleighFunctionWebsocket {
  filename: string;
  type: "websocket";
  details: {
    compiledPath?: string;
    path: string;
    handlerName: string;
    exportName: string;
  };
}

type OakleighFunction =
  | OakleighFunctionEndpoint
  | OakleighFunctionConsumer
  | OakleighFunctionWebsocket;

export function createLambdaFunction(
  component: OakleighFunction,
  environment: Record<string, Input<string>>
) {
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

  new iam.RolePolicyAttachment(
    functionEndpointName(component, "lambdaRoleAttachment"),
    {
      role: lambdaRole,
      policyArn: iam.ManagedPolicy.AWSLambdaBasicExecutionRole,
    }
  );

  new iam.RolePolicyAttachment(
    functionEndpointName(component, "lambdaFullAccessToDynamo"),
    {
      role: lambdaRole,
      policyArn: iam.ManagedPolicy.AmazonDynamoDBFullAccess,
    }
  );

  const appContents = new asset.FileArchive(component.details.compiledPath);

  const lambdaFunction = new lambda.Function(
    functionEndpointName(component, "lambdaFunction"),
    {
      code: new asset.AssetArchive({ ".": appContents }),
      runtime,
      role: lambdaRole.arn,
      handler: `${component.details.handlerName}.${component.details.exportName}`,
      environment: { variables: environment },
    }
  );

  return { lambdaFunction };
}

export function functionEndpointName(
  { details }: OakleighFunction,
  type: string
) {
  return `${camelize(details.handlerName)}_${camelize(
    details.exportName
  )}_${type}`;
}
