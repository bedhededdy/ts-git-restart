import fs from "node:fs";

export function mkdirIfNotExists(dirName: string): void {
  if (!fs.existsSync(dirName)) fs.mkdirSync(dirName);
}

export function findTsgitDir(): string {
  let dir = process.cwd();
  while (dir !== "/") {
    if (fs.existsSync(`${dir}/.tsgit`)) return dir;
    dir = dir.replace(/\/[^/]*$/, "");
  }
  return "";
}
