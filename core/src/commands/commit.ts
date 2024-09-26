import { Repository } from "repository";

export type CommitFlags = {
  message?: string;
};

export function commit(repository: Repository, commitFlags?: CommitFlags): number {
  return -1;
}
