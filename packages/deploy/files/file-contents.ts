import { Block } from "comment-parser";

export interface FileContents {
  key: string;
  filename: string;
  content: string;
  comments?: Record<string, string>;
}
