// FIXME: I THINK I ONLY NEED A TYPE IMPORT HERE
import Command, { CommandType } from "command";
import { Repository, findTsgitDir } from "tsgit-core";

import InitCommand from "commands/init";
import HashObjectCommand from "commands/hash-object";
import CatFileCommand from "commands/cat-file";
import WriteTreeCommand from "commands/write-tree";
import ReadTreeCommand from "commands/read-tree";

import { hideBin } from "yargs/helpers";

export default class CommandFactory {
  public static createCommand(argv: string[]): Command | null {
    const args = hideBin(argv);
    const commandType = args[0] as CommandType;

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
      case CommandType.CatFile:
        return new CatFileCommand(commandType, repository, args);
      case CommandType.WriteTree:
        return new WriteTreeCommand(commandType, repository, args);
      case CommandType.ReadTree:
        return new ReadTreeCommand(commandType, repository, args);
      default:
        return null;
    }
  }
}
