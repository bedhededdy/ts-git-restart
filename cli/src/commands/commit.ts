import { commit, CommitFlags } from "tsgit-core/commands";

import Command from "command";

import yargs from "yargs";

export default class CommitCommand extends Command {
  private _message = "";
  private _commitFlags: CommitFlags = {};

  public override exec(): number {
    this.parseArgs();
    return commit(this._repository, this._message, this._commitFlags);
  }

  public override parseArgs(): void {
    const argv = yargs(this._args)
      .command("commit [options]", "Record changes to the repository", (yargs) => {
        yargs.option("m", {
          alias: "message",
          type: "string",
          description: "Use the given <message> as the commit message",
          demandOption: true,
        });
      })
      .parseSync();

    this._message = argv.message as string;
  }
}
