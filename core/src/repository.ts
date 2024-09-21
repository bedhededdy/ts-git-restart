export class Repository {
  private _tsgitDir: string;

  constructor(tsgitDir?: string) {
    this._tsgitDir = tsgitDir ?? ".tsgit";
  }

  public get tsgitDir(): string {
    return this._tsgitDir;
  }
}
