import { Tree } from "tree";

import { GitObject } from "git-object";
import { Repository } from "repository";

export class Commit extends Tree {
  private _parentCommit: Commit | null;
  private _author: string;
  private _message: string;
  private _timestamp: Date;

  constructor(
    repo: Repository,
    hash: string,
    content: string,
    files: GitObject[],
    parentCommit: Commit | null,
    author: string,
    message: string,
    timestamp: Date,
  ) {
    super(repo, hash, content, files);
    this._parentCommit = parentCommit;
    this._author = author;
    this._message = message;
    this._timestamp = timestamp;
  }

  public get parentCommit(): Commit | null {
    return this._parentCommit;
  }
}
