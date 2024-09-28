import { Repository } from "../repository";
import { GitObject } from "../git-object";

export function lsTree(repository: Repository, hash: string) {
  hash = repository.matchHashPrefix(hash);
  if (!hash) {
    console.error(`fatal: Not a valid object name ${hash}`);
    return -1;
  }

  const tree = repository.readTree(hash);
  if (!tree.success) {
    console.error(`fatal: Not a valid tree object name ${hash}`);
    return -1;
  }

  console.log(GitObject.readObjBody(tree.value.content));
  return 0;
}
