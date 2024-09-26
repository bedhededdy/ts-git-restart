import { Repository } from "repository";

import fs from "node:fs";

export function writeTree(repository: Repository, dirName: string): number {
  if (!dirName || !fs.existsSync(dirName)) {
    console.error(`fatal: cannot stat '${dirName}': No such file or directory`);
    return -1;
  }

  const treeHash = repository.writeTree(dirName);
  if (!treeHash) {
    console.error(`fatal: could not write tree object`);
    return -1;
  }

  console.log(treeHash);
  return 0;
}
