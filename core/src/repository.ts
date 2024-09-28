import fs from "node:fs";
import path from "node:path";

import { GitObject, GitObjectType, GitObjectHeader } from "./git-object";
import { Blob } from "./blob";
import { Tree } from "./tree";
import { createHash, mkdirIfNotExists, isDirAncestor, compress, decompress, Result } from "./utils/lib";

type GitConfig = {
  name?: string;
  email?: string;
};

export class Repository {
  private _gitDir: string;
  private _config: GitConfig = {};

  constructor(gitDir: string) {
    this._gitDir = gitDir;

    if (fs.existsSync(`${gitDir}/config`)) {
      // TODO: Get config from here
    }

    // TODO: GET GLOBAL CONFIG

    this._config.name = "Edward Pinkston";
    this._config.email = "edward.pinkston@gmail.com";
  }

  public get gitDir(): string {
    return this._gitDir;
  }

  public get config(): GitConfig {
    return this._config;
  }

  public findGitDir(): string {
    let dir = process.cwd();
    const rootDir = path.parse(dir).root;
    while (dir !== rootDir) {
      const gitDir = path.join(dir, ".tsgit");
      if (fs.existsSync(gitDir)) return gitDir;
      dir = path.dirname(dir); // Move up one directory
    }
    return "";
  }

  public matchHashPrefix(hashPrefix: string): string {
    if (hashPrefix.length < 3) return "";

    const prefix = hashPrefix.substring(0, 2);
    const hashedObjDir = `${this._gitDir}/objects/${prefix}`;
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

  private breakHash(hash: string): string[] {
    const hashedObjDir = `${this._gitDir}/objects/${hash.substring(0, 2)}`;
    const hashedObjFile = `${hashedObjDir}/${hash.substring(2)}`;
    return [hashedObjDir, hashedObjFile];
  }

  public readObjHeader(objContent: string): Result<GitObjectHeader> {
    const objContentSplit = objContent.split("\0");
    if (objContentSplit.length !== 2) return { success: false, error: new Error("Object header is invalid") };
    const header = objContentSplit[0];

    const headerSplit = header.split(" ");
    if (headerSplit.length !== 2) return { success: false, error: new Error("Object header is invalid") };
    const [objType, objSize] = header.split(" ");
    const validObjTypes = [GitObjectType.Blob, GitObjectType.Tree, GitObjectType.Commit];
    if (!validObjTypes.includes(objType as GitObjectType))
      return { success: false, error: new Error("Object type is invalid") };

    return { success: true, value: { objType: objType as GitObjectType, objSize: parseInt(objSize) } };
  }

  public readObjBody(objContent: string): Result<string> {
    const objContentSplit = objContent.split("\0");
    if (objContentSplit.length !== 2) return { success: false, error: new Error("Object header is invalid") };
    return { success: true, value: objContentSplit[1] };
  }

  public objExists(hash: string, checkValidity?: boolean): Result<boolean> {
    const [hashedObjDir, hashedObjFile]: string[] = this.breakHash(hash);

    if (!fs.existsSync(hashedObjDir) || !fs.existsSync(hashedObjFile))
      return { success: false, error: new Error("Object does not exist") };
    if (!checkValidity) return { success: true, value: true };

    const content = this.readObjContent(hash, true);
    if (!content.success) return content;

    const contentSplit = content.value.split("\0");
    if (contentSplit.length !== 2) return { success: false, error: new Error("Object header is corrupted") };
    const [header, data] = content.value.split("\0");

    const headerSplit = header.split(" ");
    if (headerSplit.length !== 2) return { success: false, error: new Error("Object header is corrupted") };
    const [objType, objSize] = header.split(" ");

    const validObjTypes = [GitObjectType.Blob, GitObjectType.Tree, GitObjectType.Commit];
    if (!validObjTypes.includes(objType as GitObjectType))
      return { success: false, error: new Error("Object type is invalid") };

    const sizeMatchesContentLength = parseInt(objSize) === data.length;
    if (!sizeMatchesContentLength)
      return { success: false, error: new Error("Object size does not match content length") };

    return { success: true, value: true };
  }

  private readRawObj(hash: string, skipExistsCheck?: boolean): Result<Buffer> {
    if (!skipExistsCheck && !this.objExists(hash, skipExistsCheck))
      return { success: false, error: new Error("Object does not exist") };
    const [_hashedObjDir, hashedObjFile]: string[] = this.breakHash(hash);
    return { success: true, value: fs.readFileSync(hashedObjFile) };
  }

  public readObjContent(hash: string, skipExistsCheck?: boolean): Result<string> {
    const rawObj = this.readRawObj(hash, skipExistsCheck);
    if (!rawObj.success) return rawObj;
    return { success: true, value: decompress(rawObj.value) };
  }

  public readBlob(hash: string, skipExistsCheck?: boolean): Result<Blob> {
    const blobContent = this.readObjContent(hash, skipExistsCheck);
    if (!blobContent.success) return blobContent;

    const blobContentSplit = blobContent.value.split("\0");
    if (blobContentSplit.length !== 2) return { success: false, error: new Error("Object header is invalid") };
    const [header, data] = blobContent.value.split(" ");

    const headerSplit = header.split(" ");
    if (headerSplit.length !== 2) return { success: false, error: new Error("Object header is invalid") };
    const [objType, _objSize] = header.split(" ");

    if (objType !== GitObjectType.Blob) return { success: false, error: new Error("Object is not a blob") };

    return { success: true, value: new Blob(this, hash, data) };
  }

  public readTree(hash: string, skipExistsCheck?: boolean): Result<Tree> {
    const treeContent = this.readObjContent(hash, skipExistsCheck);
    if (!treeContent.success) return treeContent;

    const treeContentSplit = treeContent.value.split("\0");
    if (treeContentSplit.length !== 2) return { success: false, error: new Error("Object header is invalid") };
    const [header, data] = treeContent.value.split("\0");

    const headerSplit = header.split(" ");
    if (headerSplit.length !== 2) return { success: false, error: new Error("Object header is invalid") };
    const [objType, _objSize] = header.split(" ");

    if (objType !== GitObjectType.Tree) return { success: false, error: new Error("Object is not a tree") };

    const treeObjects: GitObject[] = [];

    // FIXME: THIS IS NOT HOW TREE OBJECTS ARE SAVED
    for (const line of data.split("\n")) {
      if (!line) continue;
      const [objType, objHash, ..._rest] = line.split(" ");
      if (objType === GitObjectType.Blob) {
        const blob = this.readBlob(objHash);
        if (!blob.success) return blob;
        treeObjects.push(blob.value);
      } else if (objType === GitObjectType.Tree) {
        const tree = this.readTree(objHash);
        if (!tree.success) return tree;
        treeObjects.push(tree.value);
      }
    }

    return { success: true, value: new Tree(this, hash, data, treeObjects) };
  }

  private writeObjectBuffer(data: Buffer, objType: GitObjectType): string {
    const objData = `${objType} ${data.length.toString()}\0${data.toString()}`;
    const hash = createHash(objData);

    const objectDir = `${this._gitDir}/objects/${hash.substring(0, 2)}`;
    const objectFile = `${objectDir}/${hash.substring(2)}`;

    mkdirIfNotExists(objectDir);

    const zlibData: Buffer = compress(objData);
    fs.writeFileSync(objectFile, zlibData);

    return hash;
  }

  private writeObject(file: string, objType: GitObjectType): Result<string> {
    if (!fs.existsSync(file)) return { success: false, error: new Error("File does not exist") };
    return { success: true, value: this.writeObjectBuffer(fs.readFileSync(file), objType) };
  }

  public writeTree(dir: string): Result<string> {
    if (!dir || !fs.existsSync(dir)) return { success: false, error: new Error("Directory does not exist") };
    if (!fs.statSync(dir).isDirectory()) return { success: false, error: new Error("Path is not a directory") };
    if (isDirAncestor(this._gitDir, dir)) return { success: true, value: "" };

    let treeObjNBytes = 0;
    let treeStr = "";
    const files: string[] = fs.readdirSync(dir);

    if (files.length === 0) return { success: true, value: "" };

    // FIXME: THIS IS NOT HOW TREE OBJECTS ARE SAVED
    for (const file of files) {
      // TODO: In real git we also need the ls -l info for the directory and file
      // FIXME: DON'T WANT TO SAVE EMPTY LINE AT END OF TREE OBJECT
      const filePath = `${dir}/${file}`;
      if (fs.statSync(filePath).isDirectory()) {
        const hash = this.writeTree(filePath);
        if (!hash) continue;
        const line = `tree ${hash} ${file}\n`;
        treeObjNBytes += line.length;
        treeStr += line;
      } else {
        const hash = this.writeObject(filePath, GitObjectType.Blob);
        const line = `blob ${hash} ${file}\n`;
        treeObjNBytes += line.length;
        treeStr += line;
      }
    }

    return { success: true, value: this.writeObjectBuffer(Buffer.from(treeStr), GitObjectType.Tree) };
  }

  public commit(message: string): Result<string> {
    const hash = this.writeTree(path.dirname(this._gitDir));
    if (!hash.success) return hash;

    const unixTimestamp = Math.floor(Date.now() / 1000);
    const timezoneOffsetMinutes = new Date().getTimezoneOffset();
    const timezoneOffsetHours = Math.floor(timezoneOffsetMinutes / 60);
    const timezoneOffsetMinutesRemainder = timezoneOffsetMinutes % 60;
    let timezoneOffset = timezoneOffsetHours.toString().padStart(2, "0");
    timezoneOffset += timezoneOffsetMinutesRemainder.toString().padStart(2, "0");
    timezoneOffset = timezoneOffsetHours < 0 ? "-" : "+" + timezoneOffset;
    const gitTimestamp = `${unixTimestamp} ${timezoneOffset}`;

    const treeLine = `tree ${hash}`;
    const parentLine = ""; // TODO: GET PARENT COMMIT
    const authorLine = `author ${this._config.name} <${this._config.email}> ${gitTimestamp}`;
    const committerLine = `committer ${this._config.name} <${this._config.email}> ${gitTimestamp}`;
    const emptyLine = "";

    const rawCommit = [treeLine, parentLine, authorLine, committerLine, emptyLine, message].join("\n");

    fs.writeFileSync(`${this._gitDir}/COMMIT_EDITMSG`, message);

    return { success: true, value: this.writeObjectBuffer(Buffer.from(rawCommit), GitObjectType.Commit) };
  }
}
