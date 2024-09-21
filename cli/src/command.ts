import { Repository } from "tsgit-core";

export enum CommandType {
  Init = "init",
  Clone = "clone",
  Add = "add",
  Status = "status",
  Diff = "diff",
  Commit = "commit",
  Restore = "restore",
  Reset = "reset",
  Remove = "rm",
  Move = "mv",
  Branch = "branch",
  Checkout = "checkout",
  Switch = "switch",
  Merge = "merge",
  Mergetool = "mergetool",
  Log = "log",
  Stash = "stash",
  Tag = "tag",
  Worktree = "worktree",
  Fetch = "fetch",
  Pull = "pull",
  Push = "push",
  Remote = "remote",
  Show = "show",
  Difftool = "difftool",
  RangeDiff = "range-diff",
  ShortLog = "shortlog",
  Apply = "apply",
  CherryPick = "chery-pick",
  Rebase = "rebase",
  Revert = "revert",
  Bisect = "bisect",
  Blame = "blame",
  Grep = "grep",
  Am = "am",
  FormatPatch = "format-patch",
  SendEmail = "send-email",
  RequestPull = "request-pull",
  Clean = "clean",
  GarbageCollect = "gc",
  FileSystemCheck = "fsck",
  Reflog = "reflog",
  FilterBranch = "filter-branch",
  Archive = "archive",
  Bundle = "bundle",
  CatFile = "cat-file",
  CheckIgnore = "check-ignore",
  CheckoutIndex = "checkout-index",
  CommitTree = "commit-tree",
  CountObjects = "count-objects",
  DiffIndex = "diff-index",
  ForEachRef = "for-each-ref",
  HashObject = "hash-object",
  ListFiles = "ls-files",
  ListTree = "ls-tree",
  MergeBase = "merge-base",
  ReadTree = "read-tree",
  RevList = "rev-list",
  RevParse = "rev-parse",
  ShowRef = "show-ref",
  SymbolicRef = "symbolicref",
  UpdateIndex = "update-index",
  UpdateRef = "update-ref",
  WriteTree = "write-tree",
}

export default abstract class Command {
  protected _commandType: CommandType;
  protected _repository: Repository;
  protected _args: string[];

  constructor(commandType: CommandType, repository: Repository, args: string[]) {
    this._commandType = commandType;
    this._repository = repository;
    this._args = args;
    this.parseArgs();
  }

  public abstract exec(): number;
  public parseArgs(): void {}
}
