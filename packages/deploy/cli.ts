#!/usr/bin/env node

import commandLineArgs from "command-line-args";

import { build } from "./commands/build";
import { cancel } from "./commands/cancel";
import { deploy } from "./commands/deploy";
import { destroy } from "./commands/destroy";

(async () => {
  const commandList = [
    { name: "command", multiple: true, defaultOption: true },
  ];
  const options = commandLineArgs(commandList);
  console.log(options);

  const handlers = await build();

  switch (options["command"]?.[0]) {
    case "cancel":
      return cancel(handlers);

    case "destroy":
      return await destroy(handlers);

    case "deploy":
      return await deploy(handlers);
  }
})();
