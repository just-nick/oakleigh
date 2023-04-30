#!/usr/bin/env node

import { getStack } from "./stack";
import { OakleighComponentSet } from "../common/oakleigh-component";

export const destroy = async (handlers: OakleighComponentSet) => {
  const { stack } = await getStack(handlers);

  console.info("destroying stack...");
  await stack.destroy({ onOutput: console.info });
  console.info("stack destroy complete");
};
