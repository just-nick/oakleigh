export interface OakleighComponentBase {
  filename: string;
  type: string;
}

export interface OakleighFunctionEndpoint extends OakleighComponentBase {
  type: "function-endpoint";
  details: {
    path: string;
    handlerName: string;
    exportName: string;
  };
}

export type OakleighComponent = OakleighFunctionEndpoint;

export type OakleighComponentSet = Record<string, OakleighComponent>;
