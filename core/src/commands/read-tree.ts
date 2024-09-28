import { Repository } from "repository";

import { stripHeader, decompress } from "tsgit-utils";

export function readTree(repository: Repository, hash: string) {
  hash = repository.matchHashPrefix(hash);
  if (!hash) {
    console.error(`fatal: Not a valid object name ${hash}`);
    return -1;
  }

  const objData: Buffer = repository.readObj(hash);
  console.log(stripHeader(decompress(objData)));

  return 0;
}
