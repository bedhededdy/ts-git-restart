import { Repository } from "../repository";

export type CommitFlags = {
  // message?: string;
  foo?: number;
};

export function commit(repository: Repository, message: string, commitFlags?: CommitFlags): number {
  const hash = repository.commit(message);
  if (!hash) return -1;
  console.log(hash);
  return 0;
}
