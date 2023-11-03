import { readFile } from "fs/promises";
import { getFiles, } from "../tools";
import { FileContents } from "./file-contents";
import { parse } from "comment-parser";

export async function fileSearch(inputPath: string) {
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

  return fileContents;
}