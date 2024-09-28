import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

export function mkdirIfNotExists(dirName: string): void {
  if (!fs.existsSync(dirName)) fs.mkdirSync(dirName);
}

export function findTsgitDir(): string {
  let dir = process.cwd();
  const rootDir = path.parse(dir).root;
  while (dir !== rootDir) {
    const tsgitDir = path.join(dir, ".tsgit");
    if (fs.existsSync(tsgitDir)) return tsgitDir;
    dir = path.dirname(dir); // Move up one directory
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

export function isDirAncestor(potentialAncestor: string, dir: string): boolean {
  // We will count dir == potentialAncestor as being an ancestor
  const resolvedAncestor = path.resolve(potentialAncestor);
  const resolvedDir = path.resolve(dir);
  return resolvedDir.startsWith(resolvedAncestor);
}

export function compress(data: string): Buffer {
  return zlib.deflateSync(data);
}

export function decompress(data: Buffer): string {
  return zlib.inflateSync(data).toString();
}
