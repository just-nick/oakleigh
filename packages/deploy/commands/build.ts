#!/usr/bin/env node

import { parse } from "comment-parser";
import { promises } from "fs";
import { getFiles } from "../tools";
import { OakleighComponentSet } from "../common/oakleigh-component";
import {
  compileFunctionEndpoint,
  mapFunctionEndpoint,
} from "./builder/function-endpoint";
import { FileContents } from "../common/file-contents";

const { readFile } = promises;

export const build = async () => {
  const cwd = process.cwd();
  const inputPath = `${cwd}/src`;
  const outputPath = `${cwd}/.dist`;

  console.log('Check for oakleigh components inside "%s"', inputPath);

  const files = await getFiles(inputPath);
  const fileContents = await Promise.all(
    files.map<Promise<FileContents>>(async (filename) => {
      const content = await readFile(filename).then((content) =>
        content.toString()
      );
      const comments = parse(content);
      const oakleighComments = comments.find((c) =>
        c.tags.some((t) => t.tag === "oakleigh")
      );
      const key = filename.split("/").slice(-1)[0].split(".")[0];

      return {
        key,
        filename,
        content,
        comments: oakleighComments?.tags.reduce(
          (set, tag) => ({ ...set, [tag.tag]: tag.name }),
          {}
        ),
      };
    })
  );

  const oakleighComponents = fileContents.reduce<OakleighComponentSet>(
    (set, contents) => {
      switch (contents.comments?.["oakleigh"]) {
        case "function-endpoint":
          return { ...set, [contents.key]: mapFunctionEndpoint(contents) };
        default:
          return set;
      }
    },
    {}
  );

  if (
    Object.values(oakleighComponents).some(
      (f) => f.type === "function-endpoint"
    )
  )
    compileFunctionEndpoint(outputPath, oakleighComponents);

  return oakleighComponents;
};
