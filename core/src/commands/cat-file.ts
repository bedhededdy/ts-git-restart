import { Repository } from "repository";

import { GitObjectType } from "git-object";
import { stripHeader } from "tsgit-utils";

export type CatFileFlags = {
  prettyPrint?: boolean;
  objType?: GitObjectType;
};

export function catFile(repository: Repository, hash: string, flags?: CatFileFlags): number {
  const objType = flags?.objType ?? GitObjectType.Blob;
  if (flags?.prettyPrint) {
    switch (objType) {
      case GitObjectType.Blob:
        const blob = repository.readBlob(hash);
        console.log(blob.content);
      case GitObjectType.Tree:
        break;
      case GitObjectType.Commit:
        console.log(stripHeader(repository.readObjStr(hash)));
        break;
      default:
        break;
    }
  }

  return 0;
}
