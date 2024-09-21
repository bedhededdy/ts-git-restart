import Command, { CommandType } from "command";

import { Repository } from "tsgit-core";
import { hashObject } from "tsgit-core/commands";

import yargs from "yargs";

export default class HashObjectCommand extends Command {
  private _fileToHash: string;

  public override exec(): number {
    return hashObject(this._repository, this._fileToHash);
  }

  public override parseArgs(): void {
    yargs
      .usage("Usage: tsgit hash-object <file>")
      .command("hash-object <file>", "Compute object ID and optionally creates a blob from a file", (yargs) => {
        yargs.positional("file", {
          type: "string",
          describe: "File to hash",
        });
      })
      .help()
      .alias("help", "h")
      .strict()
      .parse();
  }
}
