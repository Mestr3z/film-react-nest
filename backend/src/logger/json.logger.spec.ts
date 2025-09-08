import { JsonLogger } from './json.logger';

describe('JsonLogger', () => {
  let logger: JsonLogger;

  beforeEach(() => {
    logger = new JsonLogger();
    jest.restoreAllMocks();
  });

  function expectJsonLine(
    spy: jest.SpyInstance,
    level: string,
    message: unknown,
    optionalParams?: unknown[]
  ) {
    expect(spy).toHaveBeenCalledTimes(1);

    const [payload] = spy.mock.calls[0];
    const parsed = JSON.parse(String(payload));

    expect(parsed.level).toBe(level);
    expect(parsed.message).toEqual(message);

    if (optionalParams && optionalParams.length) {
      expect(Array.isArray(parsed.optionalParams)).toBe(true);
      expect(parsed.optionalParams.length).toBe(optionalParams.length);
    } else {
      expect(parsed.optionalParams).toBeUndefined();
    }

    expect(typeof parsed.ts).toBe('string');
  }

  it('log -> console.log JSON', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    logger.log('hello', { a: 1 });
    expectJsonLine(spy, 'log', 'hello', [{ a: 1 }]);
  });

  it('warn -> console.warn JSON', () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    logger.warn('be careful');
    expectJsonLine(spy, 'warn', 'be careful');
  });

  it('error -> console.error JSON', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const err = new Error('boom');
    logger.error('oops', err);
    expectJsonLine(spy, 'error', 'oops', [err]);
  });

  it('debug -> console.debug JSON', () => {
    const spy = jest.spyOn(console, 'debug').mockImplementation(() => {});
    logger.debug({ d: 1 });
    expectJsonLine(spy, 'debug', { d: 1 });
  });

  it('verbose -> console.debug JSON', () => {
    const spy = jest.spyOn(console, 'debug').mockImplementation(() => {});
    logger.verbose('v');
    expectJsonLine(spy, 'verbose', 'v');
  });
});
