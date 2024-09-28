import Command from "../command";

import { hashObject, HashObjectFlags } from "tsgit-core/commands";

import yargs from "yargs";

export default class HashObjectCommand extends Command {
  private _fileToHash = "";
  private _flags: HashObjectFlags = {};

  public override exec(): number {
    this.parseArgs();
    return hashObject(this._repository, this._fileToHash, this._flags);
  }

  public override parseArgs(): void {
    const argv = yargs(this._args)
      .usage("Usage: tsgit hash-object <file> [options]")
      .command("hash-object <file>", "Compute object ID and optionally create a blob from a file", (yargs) => {
        return yargs
          .positional("file", {
            describe: "File to hash",
            type: "string",
            demandOption: true,
          })
          .option("t", {
            alias: "objType",
            describe: "Type of the git object",
            type: "string",
            demandOption: false,
          })
          .option("w", {
            alias: "write",
            describe: "Write the hashed object to disk",
            type: "boolean",
            demandOption: false,
          });
      })
      .help()
      .alias("help", "h")
      .strict()
      .parseSync();

    this._fileToHash = argv.file as string;
    this._flags = {
      objType: (argv.objType ?? "blob") as string,
      write: (argv.write ?? false) as boolean,
    };
  }
}
