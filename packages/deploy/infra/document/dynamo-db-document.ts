import { dynamodb, iam } from "@pulumi/aws";

export interface OakleighDocument {
  type: "document";
  details: {
    documentType: string;
  };
}

export function createDynamoDbDocument() {
  const document = new dynamodb.Table("oakleighTable", {
    attributes: [
      {
        name: "pk",
        type: "S",
      },
    ],
    hashKey: "pk",
    readCapacity: 1,
    writeCapacity: 1,
  });

  return { document };
}
