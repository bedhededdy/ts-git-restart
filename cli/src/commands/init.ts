import Command from "../command";

import { init } from "tsgit-core/commands";

export default class InitCommand extends Command {
  public override exec(): number {
    this.parseArgs();
    return init();
  }

  public override parseArgs(): void {}
}
