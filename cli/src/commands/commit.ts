import { commit, CommitFlags } from "tsgit-core/commands";

import Command from "command";

import yargs from "yargs";

export default class CommitCommand extends Command {
  private _commitFlags: CommitFlags = {};

  public override exec(): number {
    this.parseArgs();
    return commit(this._repository, this._commitFlags);
  }

  public override parseArgs(): void {}
}
