import { PolicyDocument } from "@pulumi/aws/iam";

export function bucketPublicReadPolicy(bucketArn: string): PolicyDocument {
    return {
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          Principal: "*",
          Action: ["s3:GetObject"],
          Resource: [`${bucketArn}/*`],
        },
      ],
    };
  }