export interface OakleighHandler {
  tsPath: string;
  outputPath: string;
  handlerName: string;
  exportName: string;
}
export type OakleighHandlers = Record<string, OakleighHandler>;
