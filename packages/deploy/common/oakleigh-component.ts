export interface OakleighComponentBase {
  filename: string;
  type: string;
}

export interface OakleighFunctionEndpoint extends OakleighComponentBase {
  type: "endpoint";
  details: {
    compiledPath?: string;
    path: string;
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    handlerName: string;
    exportName: string;
  };
}

export type OakleighComponent = OakleighFunctionEndpoint;

export type OakleighComponentSet = Record<string, OakleighComponent>;

export function functionEndpointName(
  { details }: OakleighFunctionEndpoint,
  type: string
) {
  return `${camelize(details.handlerName)}_${camelize(
    details.exportName
  )}_${type}`;
}

const camelize = (s: string) => s.replace(/-./g, (x) => x[1].toUpperCase());
