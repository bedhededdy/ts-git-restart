import Command from "command";

import { readTree } from "tsgit-core/commands";

import yargs from "yargs";

export default class ReadTreeCommand extends Command {
  private _treeHash: string = "";

  public override exec(): number {
    this.parseArgs();
    return readTree(this._repository, this._treeHash);
  }

  public override parseArgs(): void {
    const argv = yargs(this._args)
      .usage("Usage: tsgit read-tree <hash> [options]")
      .command(
        "read-tree <hash>",
        "Read a tree object from the database and write it to the working directory",
        (yargs) => {
          return yargs.positional("hash", {
            describe: "Hash of the tree object to read",
            type: "string",
            demandOption: true,
          });
        },
      )
      .help()
      .alias("help", "h")
      .strict()
      .parseSync();

    this._treeHash = argv.hash as string;
  }
}
