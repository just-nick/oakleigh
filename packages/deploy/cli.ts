#!/usr/bin/env node

import { build } from "./commands/build";
import { deploy } from "./commands/deploy";
import { destroy } from "./commands/destroy";

(async () => {
  const handlers = await build();
  // console.log(handlers);
  // await destroy(handlers);
  await deploy(handlers);
})();
