import { Injectable, LoggerService } from '@nestjs/common';

type AnyMsg = unknown;

function tskvEscape(value: string) {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/\t/g, '\\t')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r');
}

function toStr(x: unknown): string {
  if (typeof x === 'string') return x;
  try {
    return JSON.stringify(x);
  } catch {
    return String(x);
  }
}

@Injectable()
export class TskvLogger implements LoggerService {
  private line(level: string, message: AnyMsg, optionalParams: AnyMsg[]) {
    const kv: string[] = [];
    kv.push(`level=${tskvEscape(level)}`);
    kv.push(`ts=${tskvEscape(new Date().toISOString())}`);
    kv.push(`message=${tskvEscape(toStr(message))}`);
    if (optionalParams.length) {
      kv.push(`params=${tskvEscape(toStr(optionalParams))}`);
    }
    return kv.join('\t');
  }

  log(message: AnyMsg, ...optionalParams: AnyMsg[]) {
    console.log(this.line('log', message, optionalParams));
  }

  error(message: AnyMsg, ...optionalParams: AnyMsg[]) {
    console.error(this.line('error', message, optionalParams));
  }

  warn(message: AnyMsg, ...optionalParams: AnyMsg[]) {
    console.warn(this.line('warn', message, optionalParams));
  }

  debug(message: AnyMsg, ...optionalParams: AnyMsg[]) {
    console.debug(this.line('debug', message, optionalParams));
  }

  verbose(message: AnyMsg, ...optionalParams: AnyMsg[]) {
    console.debug(this.line('verbose', message, optionalParams));
  }
}
