import { asset } from "@pulumi/pulumi";
import { iam, lambda } from "@pulumi/aws";

export function createLambdaFunction(
  path: string,
  handlerName: string,
  handlerExport: string
) {
  const functionFilename = `${path}/${handlerName}.js`;

  // const program = ts.createProgram([`${path}/${handlerFilename}.ts`], {
  //     project: `${path}/tsconfig.json`,
  //     outDir: functionFolder
  //   });
  // program.emit();

  const lambdaRole = new iam.Role("lambdaRole", {
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
  });

  const lambdaRoleAttachment = new iam.RolePolicyAttachment(
    "lambdaRoleAttachment",
    {
      role: lambdaRole,
      policyArn: iam.ManagedPolicy.AWSLambdaBasicExecutionRole,
    }
  );

  const appContents = new asset.FileArchive(path);

  const lambdaFunction = new lambda.Function("lambdaFunction", {
    code: new asset.AssetArchive({ ".": appContents }),
    runtime: "nodejs14.x",
    role: lambdaRole.arn,
    handler: `${handlerName}.${handlerExport}`,
  });

  return lambdaFunction;
}
