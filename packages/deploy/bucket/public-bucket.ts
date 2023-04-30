import { s3 } from "@pulumi/aws-native";
import * as classic from "@pulumi/aws";
import { bucketPublicReadPolicy } from "./public-policy";

export function createPublicBucket(name: string) {
  const siteBucket = new s3.Bucket(name, {
    websiteConfiguration: {
      indexDocument: "index.html",
    },
  });

  const files: Record<string, string> = {
    "index.html": `
        <html>
            <head>
                <title>Hello S3</title><meta charset="UTF-8">
            </head>
            <body>
                <p>Hello, world!</p><p>Made with ❤️ with <a href="https://pulumi.com">Pulumi</a></p>
            </body>
        </html>
    `,
  };

  Object.keys(files).forEach((key) => {
    new classic.s3.BucketObject(key, {
      bucket: siteBucket.id,
      content: files[key],
      contentType: "text/html; charset=utf-8",
      key,
    });
  });

  // Set the access policy for the bucket so all objects are readable
  new classic.s3.BucketPolicy("bucketPolicy", {
    bucket: siteBucket.id,
    policy: siteBucket.arn.apply(bucketPublicReadPolicy),
  });

  return siteBucket;
}
