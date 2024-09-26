import Command from "command";

import { writeTree } from "tsgit-core/commands";

export default class WriteTree extends Command {
  public override exec(): number {
    return writeTree(this._repository, "");
  }

  public override parseArgs(): void {}
}
