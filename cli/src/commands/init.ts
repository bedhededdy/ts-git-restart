import Command from "command";

export default class InitCommand extends Command {
  public override exec(): number {
    return -1;
  }

  public override parseArgs(): void {
  }
}

