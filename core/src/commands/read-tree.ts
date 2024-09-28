import { Repository } from "repository";

import { stripHeader, decompress } from "tsgit-utils";

export function readTree(repository: Repository, hash: string) {
  hash = repository.matchHashPrefix(hash);
  if (!hash) {
    console.error(`fatal: Not a valid object name ${hash}`);
    return -1;
  }

  // FIXME: WE ARE DOING A RECURSE HERE FOR NO REASON
  console.log(stripHeader(repository.readTree(hash).content));

  return 0;
}
