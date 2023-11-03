import { DynamoDB } from "aws-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";

export interface DynamoTable {
  pk?: string;
}

export type Unpack<T> = (item: DynamoDB.AttributeMap) => T & DynamoTable;

export async function byPk<T>(table: string, pk: string, unpack: Unpack<T>) {
  // const dynamoClient = new DocumentClient();
  const ddb = new DynamoDB();
  const TableName = getTableName(table);

  const result = await ddb
    .query({
      TableName,
      ExpressionAttributeValues: {
        ":pk": { S: pk },
      },
      KeyConditionExpression: "pk = :pk",
    })
    .promise();

  return result.Items?.map(unpack);
}

export async function add<T>(
  table: string,
  pk: string,
  data: { [key in keyof T]: DynamoDB.AttributeValue }
) {
  const ddb = new DynamoDB();
  const TableName = getTableName(table);

  await ddb
    .putItem({
      TableName,
      Item: {
        pk: { S: pk },
        ...data,
      },
    })
    .promise();
}

function getTableName(table: string) {
  const TableName = process.env[`OAKLEIGH_DYNAMO_DB_${table}`];

  if (!TableName) {
    throw new Error("Table!");
  }

  return TableName;
}
