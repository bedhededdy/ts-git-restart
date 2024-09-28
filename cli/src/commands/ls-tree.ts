import Command from "command";

import { lsTree } from "tsgit-core/commands";

import yargs from "yargs";

export default class ListTreeCommand extends Command {
  private _treeHash: string = "";

  public override exec(): number {
    this.parseArgs();
    return lsTree(this._repository, this._treeHash);
  }

  public override parseArgs(): void {
    const argv = yargs(this._args)
      .usage("Usage: tsgit ls-tree <hash> [options]")
      .command("ls-tree <hash>", "List the contents of a tree object", (yargs) => {
        return yargs.positional("hash", {
          describe: "Hash of the tree object to list",
          type: "string",
          demandOption: true,
        });
      })
      .help()
      .alias("help", "h")
      .strict()
      .parseSync();

    this._treeHash = argv.hash as string;
  }
}
