import fs from "node:fs";
import crypto from "node:crypto";

export function mkdirIfNotExists(dirName: string): void {
  if (!fs.existsSync(dirName)) fs.mkdirSync(dirName);
}

export function findTsgitDir(): string {
  let dir = process.cwd();
  while (dir !== "/") {
    if (fs.existsSync(`${dir}/.tsgit`)) return dir + "/.tsgit";
    dir = dir.replace(/\/[^/]*$/, "");
  }
  return "";
}

export function matchShortHash(tsgitDir: string, shortHash: string): string {
  if (shortHash.length < 3) return "";

  const prefix = shortHash.substring(0, 2);
  const hashedObjDir = `${tsgitDir}/objects/${prefix}`;
  if (!fs.existsSync(hashedObjDir)) return "";

  shortHash = shortHash.substring(2);

  let foundObj = "";
  const files = fs.readdirSync(hashedObjDir);
  for (const file of files) {
    const isMatch = file.startsWith(shortHash);
    if (isMatch && foundObj) {
      foundObj = "";
      break;
    }
    if (isMatch) foundObj = file;
  }

  return prefix + foundObj;
}

export function createHash(data: string): string {
  return crypto.createHash("sha1").update(data).digest("hex");
}

export function objExists(tsgitDir: string, hash: string): boolean {
  const hashedObjDir = `${tsgitDir}/objects/${hash.substring(0, 2)}`;
  const hashedObjFile = `${hashedObjDir}/${hash.substring(2)}`;
  return fs.existsSync(hashedObjDir) && fs.existsSync(hashedObjFile);
}

export function readObj(tsGitDir: string, hash: string, skipExistsCheck?: boolean): Buffer {
  if (!skipExistsCheck && !objExists(tsGitDir, hash)) throw new Error(`fatal: Not a valid object name ${hash}`);
  const hashedObjDir = `${tsGitDir}/objects/${hash.substring(0, 2)}`;
  const hashedObjFile = `${hashedObjDir}/${hash.substring(2)}`;
  return fs.readFileSync(hashedObjFile);
}

export function stripHeader(data: string): string {
  const headerEnd = data.indexOf("\0");
  return data.substring(headerEnd + 1);
}
