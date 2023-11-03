#!/usr/bin/env node

import { getStack } from "./stack";
import { OakleighInfraDescriptionSet } from "../infra/oakleigh-infra";

export const destroy = async (handlers: OakleighInfraDescriptionSet) => {
  const { stack } = await getStack(handlers);

  console.info("destroying stack...");
  await stack.destroy({ onOutput: console.info });
  console.info("stack destroy complete");
};
