import Command from "command";

export default class InitCommand extends Command {
  public override exec(): number {
    console.log("exec");
    return -1;
  }

  public override parseArgs(): void {}
}
