import { Repository } from "repository";

import fs from "node:fs";

export function mktree(repository: Repository, dirName: string): number {
  if (!dirName || !fs.existsSync(dirName)) {
    console.error(`fatal: cannot stat '${dirName}': No such file or directory`);
    return -1;
  }

  const treeHash = repository.writeTree(dirName);
  if (!treeHash) {
    console.warn(`warning: directory does not contain any files`);
    return -1;
  }

  console.log(treeHash);
  return 0;
}
