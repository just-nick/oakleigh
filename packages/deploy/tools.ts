import { resolve } from "path";
import { promises } from "fs";

const { readdir, readFile } = promises;

export async function getFiles(dir: string, match = /.*\.ts$/): Promise<string[]> {
    const dirents = await readdir(dir, { withFileTypes: true });
    const paths = dirents.map((dirent) => {
      const res = resolve(dir, dirent.name);
      return dirent.isDirectory() ? getFiles(res) : res;
    });
  
    const files = await Promise.all(paths);
  
    return Array.prototype
      .concat(...files)
      .filter((filename) => match.test(filename));
  }