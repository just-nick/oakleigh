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
  const command = options["command"]?.[0];
  console.log(options);

  switch (command) {
    case "cancel": {
      const handlers = await build();
      return cancel(handlers);
    }

    case "destroy": {
      const handlers = await build();
      return await destroy(handlers);
    }

    case "deploy": {
      const handlers = await build();
      return await deploy(handlers);
    }
  }
})();
