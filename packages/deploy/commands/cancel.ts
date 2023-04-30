#!/usr/bin/env node

import { getStack } from "./stack";
import { OakleighComponentSet } from "../common/oakleigh-component";

export const cancel = async (handlers: OakleighComponentSet) => {
  const { stack } = await getStack(handlers);

  console.info("Cancelling stack deploy...");
  await stack.cancel();
  console.info("Cancelling complete");
};
