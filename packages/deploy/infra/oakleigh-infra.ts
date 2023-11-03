import { FileContents } from "../files/file-contents";
import { OakleighDocument } from "./document/dynamo-db-document";
import {
  MethodType,
  OakleighFunctionConsumer,
  OakleighFunctionEndpoint,
  OakleighFunctionWebsocket,
  isMethodType,
} from "./function/function-endpoint";

export type OakleighInfraDescription =
  | OakleighFunctionEndpoint
  | OakleighFunctionConsumer
  | OakleighFunctionWebsocket
  | OakleighDocument;
export type OakleighInfraDescriptionSet = Record<
  string,
  OakleighInfraDescription
>;

export async function generateInfraDescriptions(
  fileContentsList: FileContents[]
) {
  return fileContentsList.reduce<OakleighInfraDescriptionSet>(
    (set, contents) => {
      const componentType = contents.comments?.["oakleigh"];
      switch (componentType) {
        case "endpoint":
          return { ...set, [contents.key]: mapFunctionEndpoint(contents) };
        case "consumer":
          return { ...set, [contents.key]: mapFunctionConsumer(contents) };
        case "websocket":
          return { ...set, [contents.key]: mapFunctionWebsocket(contents) };
        case "document": {
          return addIfExists(contents.key, mapDynamoTable(contents), set);
        }
        case undefined:
          return set;
        default:
          console.warn("Unexpected component type '%s' found", componentType);
          return set;
      }
    },
    {}
  );
}

function addIfExists(
  key: string,
  item: OakleighInfraDescription | undefined,
  set: OakleighInfraDescriptionSet
): OakleighInfraDescriptionSet {
  if (item) {
    return { ...set, [key]: item };
  }

  return set;
}

function mapDynamoTable(
  fileContents: FileContents
): OakleighDocument | undefined {
  const documentType = fileContents.comments?.["type"];

  if (!documentType) {
    console.error(
      "Could not add '%s' as document type was not included",
      fileContents.key
    );
    return;
  }

  return {
    type: "document",
    details: { documentType },
  };
}

function mapFunctionEndpoint(
  fileContents: FileContents
): OakleighFunctionEndpoint {
  const method = fileContents.comments?.["method"];
  return {
    filename: fileContents.filename,
    type: "endpoint",
    details: {
      path: fileContents.comments?.["path"] ?? "",
      method: isMethodType(method) ? method : MethodType.GET,
      handlerName: fileContents.key,
      exportName: "handler",
    },
  };
}

function mapFunctionConsumer(
  fileContents: FileContents
): OakleighFunctionConsumer {
  return {
    filename: fileContents.filename,
    type: "consumer",
    details: {
      snsTopic: fileContents.comments?.["snsTopic"] ?? "",
      handlerName: fileContents.key,
      exportName: "handler",
    },
  };
}

function mapFunctionWebsocket(
  fileContents: FileContents
): OakleighFunctionWebsocket {
  return {
    filename: fileContents.filename,
    type: "websocket",
    details: {
      path: fileContents.comments?.["path"] ?? "",
      handlerName: fileContents.key,
      exportName: "handler",
    },
  };
}
