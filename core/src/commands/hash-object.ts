import { Repository } from "../repository";

import { mkdirIfNotExists, createHash, compress } from "../utils/lib";

import fs from "node:fs";

export type HashObjectFlags = {
  objType?: string;
  write?: boolean;
};

export function hashObject(repository: Repository, fileToHash: string, flags?: HashObjectFlags): number {
  if (!fs.existsSync(fileToHash)) {
    console.error(`fatal: pathspec '${fileToHash}' did not match any files`);
    return -1;
  }

  const data: Buffer = fs.readFileSync(fileToHash);
  const objType = flags?.objType ?? "blob";
  const objData = `${objType} ${data.length.toString()}\0${data.toString()}`;
  const hash: string = createHash(objData);

  if (flags?.write) {
    const objectDir = `${repository.gitDir}/objects/${hash.substring(0, 2)}`;
    const objectFile = `${objectDir}/${hash.substring(2)}`;

    mkdirIfNotExists(objectDir);

    const zlibData: Buffer = compress(objData);
    fs.writeFileSync(objectFile, zlibData);
  }

  console.log(hash);
  return 0;
}
