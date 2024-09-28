import { Repository } from "repository";

import { stripHeader, decompress } from "tsgit-utils";

export type CatFileFlags = {
  prettyPrint?: boolean;
};

export function catFile(repository: Repository, hash: string, flags?: CatFileFlags): number {
  try {
    if (flags?.prettyPrint) {
      // FIXME: NEED TO HANDLE OTHER OBJECT TYPES
      console.log(stripHeader(repository.readBlob(hash).content));
    } else {
      // FIXME: THIS IS NOT HOW REAL GIT DOES CAT-FILE
      // console.log(objData);
    }
  } catch (e: any) {
    // FIXME: NEED TO TYPE E AS ERROR
    console.error(e.message);
    return -1;
  }

  return 0;
}
