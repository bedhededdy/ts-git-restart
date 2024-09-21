import { Repository } from "repository";

import { readObj, stripHeader } from "../lib";

import zlib from "node:zlib";

export type CatFileFlags = {
  prettyPrint?: boolean;
};

export function catFile(repository: Repository, hash: string, flags?: CatFileFlags): number {
  try {
    const objData: Buffer = readObj(repository.tsgitDir, hash);
    if (flags?.prettyPrint) {
      console.log(stripHeader(zlib.inflateSync(objData).toString()));
    } else {
      console.log(objData);
    }
  } catch (e: any) {
    // FIXME: NEED TO TYPE E AS ERROR
    console.error(e.message);
    return -1;
  }

  return 0;
}
