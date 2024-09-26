import { Repository } from "repository";

import { stripHeader } from "../lib";

import zlib from "node:zlib";

export function readTree(repository: Repository, hash: string) {
  hash = repository.matchHashPrefix(hash);
  if (!hash) {
    console.error(`fatal: Not a valid object name ${hash}`);
    return -1;
  }

  const objData: Buffer = repository.readObj(hash);
  console.log(stripHeader(zlib.inflateSync(objData).toString()));

  return 0;
}
