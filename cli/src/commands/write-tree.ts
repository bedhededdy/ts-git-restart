import Command from "command";

import { writeTree } from "tsgit-core/commands";

import yargs from "yargs";

export default class WriteTree extends Command {
  private _treeDir: string = "";

  public override exec(): number {
    this.parseArgs();
    return writeTree(this._repository, this._treeDir);
  }

  public override parseArgs(): void {
    const argv = yargs(this._args)
      .usage("Usage: tsgit write-tree <dir> [options]")
      .command(
        "write-tree <dir>",
        "Construct a tree object (recursively writing nested trees and objects), store it in the database, and output the hash",
        (yargs) => {
          return yargs.positional("dir", {
            describe: "Directory to create tree object from",
            type: "string",
            demandOption: true,
          });
        },
      )
      .help()
      .alias("help", "h")
      .strict()
      .parseSync();

    this._treeDir = argv.dir as string;
  }
}
