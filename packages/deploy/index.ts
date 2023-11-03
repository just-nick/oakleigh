import { build } from "./commands/build";
import { deploy } from "./commands/deploy";
import { destroy } from "./commands/destroy";
// import { stack } from "./commands/stack";
import { cancel } from "./commands/cancel";

export const Commands = {
  build,
  deploy,
  destroy,
  cancel,
};
