import { createHash, mkdirIfNotExists, isDirAncestor } from "./lib";

import fs from "node:fs";
import zlib from "node:zlib";

type GitConfig = {
  name?: string;
  email?: string;
};

export class Repository {
  private _tsgitDir: string;
  private _config: GitConfig = {};

  constructor(tsgitDir: string) {
    this._tsgitDir = tsgitDir;

    if (fs.existsSync(`${tsgitDir}/config`)) {
      // TODO: Get config from here
    }

    // TODO: GET GLOBAL CONFIG

    this._config.name = "Edward Pinkston";
    this._config.email = "edward.pinkston@gmail.com";
  }

  public get tsgitDir(): string {
    return this._tsgitDir;
  }

  public get config(): GitConfig {
    return this._config;
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

  public writeObject(file: string, objType?: string): string {
    const data: Buffer = fs.readFileSync(file);
    objType = objType ?? "blob";
    const objData = `${objType} ${data.length.toString()}\0${data.toString()}`;
    const hash = createHash(objData);

    const objectDir = `${this._tsgitDir}/objects/${hash.substring(0, 2)}`;
    const objectFile = `${objectDir}/${hash.substring(2)}`;

    mkdirIfNotExists(objectDir);

    const zlibData: Buffer = zlib.deflateSync(objData);
    fs.writeFileSync(objectFile, zlibData);

    return hash;
  }

  public writeTree(dir: string): string {
    if (!dir || !fs.existsSync(dir)) throw new Error(`fatal: cannot stat '${dir}': No such file or directory`);
    if (!fs.statSync(dir).isDirectory()) throw new Error(`fatal: not a directory: '${dir}'`);
    if (isDirAncestor(this._tsgitDir, dir)) return "";

    let treeObjNBytes = 0;
    let lines: string[] = [];
    const files: string[] = fs.readdirSync(dir);

    if (files.length === 0) return "";

    for (const file of files) {
      // TODO: In real git we also need the ls -l info for the directory and file
      // FIXME: DON'T WANT TO SAVE EMPTY LINE AT END OF TREE OBJECT
      const filePath = `${dir}/${file}`;
      if (fs.statSync(filePath).isDirectory()) {
        const hash = this.writeTree(filePath);
        if (!hash) continue;
        const line = `tree ${hash} ${file}\n`;
        treeObjNBytes += line.length;
        lines.push(line);
      } else {
        const hash = this.writeObject(filePath);
        const line = `blob ${hash} ${file}\n`;
        treeObjNBytes += line.length;
        lines.push(line);
      }
    }

    const treeObj = `tree ${treeObjNBytes}\0${lines.join("")}`;
    const hash = createHash(treeObj);
    const objDir = `${this._tsgitDir}/objects/${hash.substring(0, 2)}`;
    const objFile = `${objDir}/${hash.substring(2)}`;

    mkdirIfNotExists(objDir);

    const zlibData: Buffer = zlib.deflateSync(treeObj);
    fs.writeFileSync(objFile, zlibData);

    return hash;
  }

  public commit(message: string): string {
    return "";
  }
}
