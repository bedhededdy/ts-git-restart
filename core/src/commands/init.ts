import fs from "node:fs";

export function init(): number {
  if (fs.existsSync(".tsgit")) {
    console.error("Init: Repository already initialized");
    return -1;
  }
  fs.mkdirSync(".tsgit");
  fs.mkdirSync(".tsgit/objects");
  fs.mkdirSync(".tsgit/refs");
  fs.mkdirSync(".tsgit/refs/heads");
  fs.mkdirSync(".tsgit/refs/tags");
  fs.writeFileSync(".tsgit/HEAD", "ref: refs/heads/master\n");
  fs.writeFileSync(".tsgit/description", "Unnamed repository; edit this file 'description' to name the repository.\n");
  return 0;
}
