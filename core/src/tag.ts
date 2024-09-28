import { Commit } from "commit";
import { GitObject, GitObjectType } from "git-object";

export class Tag extends GitObject {
  private _name: string;
  private _commit: Commit;

  constructor(name: string, commit: Commit) {
    super(commit.repository, commit.hash, commit.content, GitObjectType.Tag);
    this._name = name;
    this._commit = commit;
  }
}
