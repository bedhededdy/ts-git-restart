import type { Repository } from "./repository";
import { Result } from "./utils/lib";

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

  public static readObjHeader(objContent: string): Result<GitObjectHeader> {
    const objContentSplit = objContent.split("\0");
    if (objContentSplit.length !== 2) return { success: false, error: new Error("Object header is invalid") };
    const header = objContentSplit[0];

    const headerSplit = header.split(" ");
    if (headerSplit.length !== 2) return { success: false, error: new Error("Object header is invalid") };
    const [objType, objSize] = header.split(" ");

    const validObjTypes = [GitObjectType.Blob, GitObjectType.Tree, GitObjectType.Commit];
    if (!validObjTypes.includes(objType as GitObjectType))
      return { success: false, error: new Error("Object type is invalid") };

    return { success: true, value: { objType: objType as GitObjectType, objSize: parseInt(objSize) } };
  }

  public static readObjBody(objContent: string): Result<string> {
    const objContentSplit = objContent.split("\0");
    if (objContentSplit.length !== 2) return { success: false, error: new Error("Object header is invalid") };
    return { success: true, value: objContentSplit[1] };
  }
}
