import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

// TODO: CREATE A BUNCH OF WRAPPERS FOR FS FUNCTIONSJJ

export type Result<T> = { success: true; value: T } | { success: false; error: Error };

export function mkdirIfNotExists(dir: string, recursive?: boolean): void {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive });
}

export function createHash(data: string): string {
  return crypto.createHash("sha1").update(data).digest("hex");
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
