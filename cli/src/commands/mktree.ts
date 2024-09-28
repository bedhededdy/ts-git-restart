import Command from "../command";

import { mktree } from "tsgit-core/commands";

import yargs from "yargs";

export default class MakeTreeCommand extends Command {
  private _treeDir: string = "";

  public override exec(): number {
    this.parseArgs();
    return mktree(this._repository, this._treeDir);
  }

  public override parseArgs(): void {
    const argv = yargs(this._args)
      .usage("Usage: tsgit mktree <dir> [options]")
      .command(
        "mktree <dir>",
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
