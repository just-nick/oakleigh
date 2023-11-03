#!/usr/bin/env node

import commandLineArgs from "command-line-args";

import { Commands } from "@oakleigh/deploy";

(async () => {
  const commandList = [
    { name: "command", multiple: true, defaultOption: true },
  ];
  const options = commandLineArgs(commandList);
  const command = options["command"]?.[0];
  console.log(options);

  switch (command) {
    case "cancel": {
      const handlers = await Commands.build();
      return Commands.cancel(handlers);
    }

    case "destroy": {
      const handlers = await Commands.build();
      return await Commands.destroy(handlers);
    }

    case "deploy": {
      const handlers = await Commands.build();
      return await Commands.deploy(handlers);
    }
  }
})();
