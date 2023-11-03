#!/usr/bin/env node

import { getStack } from "./stack";
import { OakleighInfraDescriptionSet } from "../infra/oakleigh-infra";

export const cancel = async (handlers: OakleighInfraDescriptionSet) => {
  const { stack } = await getStack(handlers);

  console.info("Cancelling stack deploy...");
  await stack.cancel();
  console.info("Cancelling complete");
};
