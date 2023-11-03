#!/usr/bin/env node

import { generateInfraDescriptions } from "../infra/oakleigh-infra";
import { compileFunctions } from "../compiler/compile";
import { fileSearch } from "../files/search";
import { compilableTypes } from "../common/constants";

export const build = async () => {
  const cwd = process.cwd();
  const inputPath = `${cwd}/src`;
  const outputPath = `${cwd}/.dist`;

  console.log('Check for oakleigh components inside "%s"', inputPath);
  const fileContents = await fileSearch(inputPath);
  const infraDescriptions = await generateInfraDescriptions(fileContents);

  if (
    Object.values(infraDescriptions).some((f) =>
      compilableTypes.includes(f.type)
    )
  ) {
    compileFunctions(outputPath, infraDescriptions);
  }

  return infraDescriptions;
};
