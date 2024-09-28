import { Repository } from "repository";

import { stripHeader } from "tsgit-utils";

export function lsTree(repository: Repository, hash: string) {
  hash = repository.matchHashPrefix(hash);
  if (!hash) {
    console.error(`fatal: Not a valid object name ${hash}`);
    return -1;
  }

  const tree = repository.readTree(hash);
  if (!tree) {
    console.error(`fatal: Not a valid tree object name ${hash}`);
    return -1;
  }

  console.log(stripHeader(tree.content));
  return 0;
}
