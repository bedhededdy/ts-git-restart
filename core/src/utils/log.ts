export enum LogLevel {
  DEBUG,
  INFO,
  WARN,
  ERROR,
}

export default class Logger {
  private _logLevel: LogLevel;
  private _fromCommand: string;

  constructor(logLevel: LogLevel, fromCommand: string) {
    this._logLevel = logLevel;
    this._fromCommand = fromCommand;
  }

  public log(message: string): void {
    console.log(message);
  }

  public debug(message: string): void {
    if (this._logLevel <= LogLevel.DEBUG) {
      console.debug(`[${this._fromCommand}]: ${message}`);
    }
  }

  public trace(message: string): void {
    if (this._logLevel <= LogLevel.DEBUG) {
      console.trace(`[${this._fromCommand}]: ${message}`);
    }
  }

  public info(message: string): void {
    if (this._logLevel <= LogLevel.INFO) {
      console.info(`[${this._fromCommand}]: ${message}`);
    }
  }

  public warn(message: string): void {
    if (this._logLevel <= LogLevel.WARN) {
      console.warn(`[${this._fromCommand}]: ${message}`);
    }
  }

  public error(message: string): void {
    if (this._logLevel <= LogLevel.ERROR) {
      console.error(`[${this._fromCommand}]: ${message}`);
    }
  }
}
