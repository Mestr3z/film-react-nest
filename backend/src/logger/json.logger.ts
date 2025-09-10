import { Injectable, LoggerService } from '@nestjs/common';

type AnyMsg = unknown;

@Injectable()
export class JsonLogger implements LoggerService {
  private format(level: string, message: AnyMsg, optionalParams: AnyMsg[]) {
    return JSON.stringify({
      level,
      message,
      optionalParams: optionalParams.length ? optionalParams : undefined,
      ts: new Date().toISOString(),
    });
  }

  log(message: AnyMsg, ...optionalParams: AnyMsg[]) {
    console.log(this.format('log', message, optionalParams));
  }

  error(message: AnyMsg, ...optionalParams: AnyMsg[]) {
    console.error(this.format('error', message, optionalParams));
  }

  warn(message: AnyMsg, ...optionalParams: AnyMsg[]) {
    console.warn(this.format('warn', message, optionalParams));
  }

  debug(message: AnyMsg, ...optionalParams: AnyMsg[]) {
    console.debug(this.format('debug', message, optionalParams));
  }

  verbose(message: AnyMsg, ...optionalParams: AnyMsg[]) {
    console.debug(this.format('verbose', message, optionalParams));
  }

  formatMessage(level: string, message: any, ...optionalParams: any[]): string {
    return JSON.stringify({ level, message, optionalParams });
  }
}
