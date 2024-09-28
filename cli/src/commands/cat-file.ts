import Command from "../command";

import { catFile, CatFileFlags } from "tsgit-core/commands";

import type { GitObjectType } from "tsgit-core";

import yargs, { conflicts } from "yargs";

export default class CatFileCommand extends Command {
  private _objHash = "";
  private _objType: GitObjectType | undefined;
  private _flags: CatFileFlags = {};

  public override exec(): number {
    this.parseArgs();
    const result = catFile(this._repository, this._objHash, this._objType, this._flags);
    if (!result.success) {
      console.error(result.error.message);
      return 1;
    }
    if (!this._flags.showExists) console.log(result.value);
    return 0;
  }

  public override parseArgs(): void {
    const argv = yargs(this._args)
      .command("cat-file <objType> <hash> [options]", "Display the content of an object", (yargs) => {
        yargs
          .options({
            "p": {
              alias: "pretty",
              type: "boolean",
              description: "Pretty print the object",
              conflict: ["t", "s"],
            },
            "t": {
              alias: "type",
              type: "boolean",
              description: "Print the type of the object",
              conflicts: ["p", "s"],
            },
            "s": {
              alias: "size",
              type: "boolean",
              description: "Print the size of the object",
              conflicts: ["p", "t"],
            },
            "e": {
              alias: "exists",
              type: "boolean",
              description: "Return non-zero exit code if the object does not exist",
            },
          })
          .positional("objType", {
            describe: "The type of the object",
            type: "string",
            choices: ["blob", "tree", "commit", "tag"],
            demandOption: false,
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
    this._objType = argv.objType as GitObjectType | undefined;
    this._flags = {
      prettyPrint: argv.pretty as boolean,
      showExists: argv.exists as boolean,
      showSize: argv.exists as boolean,
      showType: argv.type as boolean,
    };
  }
}
