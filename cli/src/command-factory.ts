// FIXME: I THINK I ONLY NEED A TYPE IMPORT HERE
import Command, { CommandType } from "command";
import { Repository, findTsgitDir } from "tsgit-core";

import InitCommand from "commands/init";
import HashObjectCommand from "commands/hash-object";

export default class CommandFactory {
  public static createCommand(argv: string[]): Command | null {
    // FIXME: THIS IS NOT PROD SUITABLE
    const commandIdx = argv[0].includes("node") ? 2 : 1;
    const commandType = argv[commandIdx] as CommandType;
    const args = argv.slice(commandIdx + 1);

    const tsgitDir = findTsgitDir();
    if (!tsgitDir && commandType !== CommandType.Init) {
      console.error("fatal: not a tsgit repository (or any of the parent directories): .tsgit");
      return null;
    }

    const repository = new Repository(tsgitDir);

    switch (commandType) {
      case CommandType.Init:
        return new InitCommand(commandType, repository, args);
      case CommandType.HashObject:
        return new HashObjectCommand(commandType, repository, args);
      default:
        return null;
    }
  }
}
