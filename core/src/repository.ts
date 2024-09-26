import { findTsgitDir } from "./lib";

import fs from "node:fs";

export class Repository {
  private _tsgitDir: string;

  constructor(tsgitDir: string) {
    this._tsgitDir = tsgitDir;
  }

  public get tsgitDir(): string {
    return this._tsgitDir;
  }

  public matchHashPrefix(hashPrefix: string): string {
    if (hashPrefix.length < 3) return "";

    const prefix = hashPrefix.substring(0, 2);
    const hashedObjDir = `${this._tsgitDir}/objects/${prefix}`;
    if (!fs.existsSync(hashedObjDir)) return "";

    hashPrefix = hashPrefix.substring(2);

    let foundObj = "";
    const files = fs.readdirSync(hashedObjDir);
    for (const file of files) {
      const isMatch = file.startsWith(hashPrefix);
      if (isMatch && foundObj) {
        foundObj = "";
        break;
      }
      if (isMatch) foundObj = file;
    }

    if (!foundObj) return "";

    return prefix + foundObj;
  }

  public objExists(hash: string): boolean {
    const hashedObjDir = `${this._tsgitDir}/objects/${hash.substring(0, 2)}`;
    const hashedObjFile = `${hashedObjDir}/${hash.substring(2)}`;
    return fs.existsSync(hashedObjDir) && fs.existsSync(hashedObjFile);
  }

  public readObj(hash: string, skipExistsCheck?: boolean): Buffer {
    if (!skipExistsCheck && !this.objExists(hash)) throw new Error(`fatal: Not a valid object name ${hash}`);
    const hashedObjDir = `${this._tsgitDir}/objects/${hash.substring(0, 2)}`;
    const hashedObjFile = `${hashedObjDir}/${hash.substring(2)}`;
    return fs.readFileSync(hashedObjFile);
  }

  public writeObject(file: string): string {}

  public writeTree(dir: string): string {}
}
