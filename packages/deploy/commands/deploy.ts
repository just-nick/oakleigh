#!/usr/bin/env node

import { OakleighInfraDescriptionSet } from "../infra/oakleigh-infra";
import { getStack } from "./stack";

export const deploy = async (handlers: OakleighInfraDescriptionSet) => {
  const { stack } = await getStack(handlers);

  console.info("refreshing stack...");
  await stack.refresh({ onOutput: console.info });
  console.info("refresh complete");

  console.info("updating stack...");
  const upRes = await stack.up({ onOutput: console.info });
  console.log(
    `update summary: \n${JSON.stringify(
      upRes.summary.resourceChanges,
      null,
      4
    )}`
  );
  // console.log(`website url: ${upRes.outputs.websiteUrl.value}`);
};
