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

export function createHash(data: string): string {
  return crypto.createHash("sha1").update(data).digest("hex");
}

export function stripHeader(data: string): string {
  const headerEnd = data.indexOf("\0");
  return data.substring(headerEnd + 1);
}
