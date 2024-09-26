import { Repository } from "repository";

import { hashObject } from "commands/hash-object";

import fs from "node:fs";

export function writeTree(repository: Repository, dirName: string): number {
  if (!fs.existsSync(dirName)) {
    console.error(`fatal: cannot stat '${dirName}': No such file or directory`);
    return -1;
  }

  return repository.writeTree(dirName);
}
