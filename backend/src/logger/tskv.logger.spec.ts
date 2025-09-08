import { TskvLogger } from './tskv.logger';

describe('TskvLogger', () => {
  let logger: TskvLogger;

  beforeEach(() => {
    logger = new TskvLogger();
    jest.restoreAllMocks();
  });

  function parseTskv(line: string) {
    const kv: Record<string, string> = {};
    for (const part of line.split('\t')) {
      if (!part) continue;
      const eq = part.indexOf('=');
      if (eq === -1) continue;
      const k = part.slice(0, eq);
      const v = part.slice(eq + 1);
      kv[k] = v;
    }
    return kv;
  }

  function expectTskv(
    spy: jest.SpyInstance,
    level: string,
    message: unknown,
    hasParams = false
  ) {
    expect(spy).toHaveBeenCalledTimes(1);
    const [lineUnknown] = spy.mock.calls[0];
    const line = String(lineUnknown);

    const kv = parseTskv(line);
    expect(kv.level).toBe(level);
    expect(kv.message).toBe(String(message));
    expect(typeof kv.ts).toBe('string');

    if (hasParams) {
      expect(
        /\t(optionalParams|params)=/.test(line)
      ).toBe(true);
    }
  }

  it('log -> console.log TSKV', () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    logger.log('hello', { a: 1 });
    expectTskv(logSpy, 'log', 'hello', true);
  });

  it('warn -> console.warn TSKV', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    logger.warn('careful');
    expectTskv(warnSpy, 'warn', 'careful');
  });

  it('error -> console.error TSKV', () => {
    const errSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    logger.error('oops');
    expectTskv(errSpy, 'error', 'oops');
  });

  it('debug -> console.debug TSKV', () => {
    const dbgSpy = jest.spyOn(console, 'debug').mockImplementation(() => {});
    logger.debug('dbg');
    expectTskv(dbgSpy, 'debug', 'dbg');
  });

  it('verbose -> console.debug TSKV', () => {
    const dbgSpy = jest.spyOn(console, 'debug').mockImplementation(() => {});
    logger.verbose('verb');
    expectTskv(dbgSpy, 'verbose', 'verb');
  });
});
