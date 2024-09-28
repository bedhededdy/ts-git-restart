import { GitObject, GitObjectType } from "git-object";
import { Repository } from "repository";

export class Tree extends GitObject {
  private _files: GitObject[] = [];

  constructor(repo: Repository, hash: string, content: string, files: GitObject[]) {
    super(repo, hash, content, GitObjectType.Tree);
    this._files = files;
  }

  public get files(): GitObject[] {
    return this._files;
  }
}
