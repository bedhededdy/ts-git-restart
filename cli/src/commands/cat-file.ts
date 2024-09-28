import Command from "../command";

import { catFile, CatFileFlags } from "tsgit-core/commands";

import type { GitObjectType } from "tsgit-core";

import yargs from "yargs";

export default class CatFileCommand extends Command {
  private _objHash = "";
  private _objType: GitObjectType | undefined;
  private _flags: CatFileFlags = {};

  public override exec(): number {
    this.parseArgs();
    return catFile(this._repository, this._objHash, this._objType, this._flags);
  }

  public override parseArgs(): void {
    const argv = yargs(this._args)
      .command("cat-file <hash>", "Display the content of an object", (yargs) => {
        yargs
          .options({
            "p": {
              alias: "pretty",
              type: "boolean",
              description: "Pretty print the object",
              default: false,
            },
            "t": {
              alias: "type",
              type: "string",
              description: "Specify the expected type of the object",
              requiresArg: true,
            },
          })
          .positional("hash", {
            describe: "The hash of the object",
            type: "string",
            demandOption: true,
          });
      })
      .parseSync();

    // FIXME: NEED TO CATCH POTENTIAL ERROR
    this._objHash = this._repository.matchHashPrefix(argv.hash as string);
    this._flags = {
      prettyPrint: argv.pretty as boolean,
      objType: argv.type as GitObjectType,
    };
  }
}
