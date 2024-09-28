import { Repository } from "./repository";

export enum GitObjectType {
  Blob = "blob",
  Tree = "tree",
  Commit = "commit",
  Tag = "tag",
}

export type GitObjectHeader = {
  objType: GitObjectType;
  objSize: number;
};

export abstract class GitObject {
  private _hash: string;
  private _content: string;
  private _gitObjectType: GitObjectType;
  private _repository: Repository;

  constructor(repository: Repository, hash: string, content: string, gitObjectType: GitObjectType) {
    this._repository = repository;
    this._hash = hash;
    this._content = content;
    this._gitObjectType = gitObjectType;
  }

  public get hash(): string {
    return this._hash;
  }

  public get content(): string {
    return this._content;
  }

  public get gitObjectType(): GitObjectType {
    return this._gitObjectType;
  }

  public get repository(): Repository {
    return this._repository;
  }
}
