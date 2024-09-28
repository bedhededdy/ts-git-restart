import { Repository } from "../repository";
import { GitObjectType } from "../git-object";
import { Result } from "../utils/lib";

export type CatFileFlags = {
  prettyPrint?: boolean;
  showExists?: boolean;
  showSize?: boolean;
  showType?: GitObjectType;
};

export function catFile(
  repository: Repository,
  hash: string,
  objType?: GitObjectType,
  flags?: CatFileFlags,
): Result<string> {
  if (flags?.prettyPrint) {
  } else if (flags?.showExists) {
    if (repository.objExists(hash, true)) {
      return { success: true, value: "" };
    } else {
      return { success: false, value: "" };
    }
  } else if (flags?.showType) {
    const obj = repository.readObjContent(hash);
    if (!obj.success) return obj;
  } else if (flags?.showSize) {
    return -1;
  } else {
  }

  return 0;
}
