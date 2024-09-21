// FIXME: I THINK I ONLY NEED A TYPE IMPORT HERE
import Command, { CommandType } from "command";
import { Repository } from "tsgit-core";

import InitCommand from "./commands/init";

export default class CommandFactory {
  public static createCommand(argv: string[]): Command | null {
    // FIXME: THIS IS NOT PROD SUITABLE
    const commandIdx = argv[0].includes("node") ? 2 : 1;
    const commandType = argv[commandIdx] as CommandType;
    const args = argv.slice(commandIdx + 1);

    switch (commandType) {
      case CommandType.Init:
        return new InitCommand(commandType, new Repository(), args);
        return null;
      default:
        return null;
    }
  }
}
