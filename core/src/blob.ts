import { GitObject, GitObjectType } from "git-object";
import { Repository } from "repository";

export class Blob extends GitObject {
  constructor(repo: Repository, hash: string, content: string) {
    super(repo, hash, content, GitObjectType.Blob);
  }
}
