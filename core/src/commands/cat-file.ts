import { Repository } from "../repository";
import { GitObject, GitObjectType } from "../git-object";
import { Result } from "../utils/lib";

export type CatFileFlags = {
  prettyPrint?: boolean;
  showExists?: boolean;
  showSize?: boolean;
  showType?: boolean;
};

export function catFile(
  repository: Repository,
  hash: string,
  objType?: GitObjectType,
  flags?: CatFileFlags,
): Result<string> {
  if (flags?.prettyPrint || objType !== undefined) {
    const obj = repository.readObjContent(hash);
    if (!obj.success) return obj;
    const body = GitObject.readObjBody(obj.value);
    if (!body.success) return body;
    return { success: true, value: body.value };
  }

  if (flags?.showExists) {
    if (repository.objExists(hash, true)) return { success: true, value: "" };
    return { success: false, error: new Error("Object not found") };
  }

  if (flags?.showType) {
    const obj = repository.readObjContent(hash);
    if (!obj.success) return obj;
    const header = GitObject.readObjHeader(obj.value);
    if (!header.success) return header;
    return { success: true, value: header.value.objType };
  }

  if (flags?.showSize) {
    const obj = repository.readObjContent(hash);
    if (!obj.success) return obj;
    const header = GitObject.readObjHeader(obj.value);
    if (!header.success) return header;
    return { success: true, value: header.value.objSize.toString() };
  }

  const obj = repository.readRawObj(hash);
  if (!obj.success) return obj;
  return { success: true, value: obj.value.toString() };
}
