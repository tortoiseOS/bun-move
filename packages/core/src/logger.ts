/**
 * Logger utility for TortoiseOS
 */

export type LogLevel = "debug" | "info" | "warn" | "error";

export class Logger {
  private prefix: string;
  private level: LogLevel;

  constructor(prefix: string, level: LogLevel = "info") {
    this.prefix = prefix;
    this.level = level;
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ["debug", "info", "warn", "error"];
    return levels.indexOf(level) >= levels.indexOf(this.level);
  }

  debug(message: string, ...args: any[]): void {
    if (this.shouldLog("debug")) {
      console.debug(`[${this.prefix}] DEBUG:`, message, ...args);
    }
  }

  info(message: string, ...args: any[]): void {
    if (this.shouldLog("info")) {
      console.info(`[${this.prefix}] INFO:`, message, ...args);
    }
  }

  warn(message: string, ...args: any[]): void {
    if (this.shouldLog("warn")) {
      console.warn(`[${this.prefix}] WARN:`, message, ...args);
    }
  }

  error(message: string, ...args: any[]): void {
    if (this.shouldLog("error")) {
      console.error(`[${this.prefix}] ERROR:`, message, ...args);
    }
  }
}

export const createLogger = (prefix: string): Logger => {
  const level = (process.env.LOG_LEVEL as LogLevel) || "info";
  return new Logger(prefix, level);
};
