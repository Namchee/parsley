import { describe, expect, it } from 'vitest';

import { InvalidFlagError, parseCLI } from '.';

describe('parseCLI', () => {
  it('should be able to parse empty string without throwing exception', () => {
    const command = '';

    const cli = parseCLI(command);

    expect(cli.command).toBe('');
    expect(cli.args.length).toBe(0);
    expect(Object.keys(cli.flags).length).toBe(0);
  });

  it('should parse CLI without arguments and flags', () => {
    const command = 'jest';

    const cli = parseCLI(command);

    expect(cli.command).toBe('jest');
    expect(cli.args.length).toBe(0);
    expect(Object.keys(cli.flags).length).toBe(0);
  });

  it('should be able to parse args', () => {
    const command = 'jest src/*';

    const cli = parseCLI(command);

    expect(cli.command).toBe('jest');
    expect(cli.args).toStrictEqual(['src/*']);
    expect(Object.keys(cli.flags).length).toBe(0);
  });

  it('should be able to parse multiple args', () => {
    const command = 'jest src/* bin/* docs/*';

    const cli = parseCLI(command);

    expect(cli.command).toBe('jest');
    expect(cli.args).toStrictEqual(['src/*', 'bin/*', 'docs/*']);
    expect(Object.keys(cli.flags).length).toBe(0);
  });

  it('should be able to parse flags', () => {
    const command = 'jest src/* --foo bar';

    const cli = parseCLI(command);

    expect(cli.command).toBe('jest');
    expect(cli.args).toStrictEqual(['src/*']);
    expect(cli.flags).toStrictEqual({ foo: ['bar'] });
  });

  it('should be able to parse flags with multiple value', () => {
    const command = 'jest src/* --foo bar --foo baz --foo bal';

    const cli = parseCLI(command);

    expect(cli.command).toBe('jest');
    expect(cli.args).toStrictEqual(['src/*']);
    expect(cli.flags).toStrictEqual({ foo: ['bar', 'baz', 'bal'] });
  });

  it('should be able to parse flags with equal-sign style', () => {
    const command = 'jest src/* --foo=bar';

    const cli = parseCLI(command);

    expect(cli.command).toBe('jest');
    expect(cli.args).toStrictEqual(['src/*']);
    expect(cli.flags).toStrictEqual({ foo: ['bar'] });
  });

  it('should be able to parse flags with mixed style of writing', () => {
    const command = 'jest src/* --foo=bar --foo baz';

    const cli = parseCLI(command);

    expect(cli.command).toBe('jest');
    expect(cli.args).toStrictEqual(['src/*']);
    expect(cli.flags).toStrictEqual({ foo: ['bar', 'baz'] });
  });

  it('should be able to parse flags with shorthand', () => {
    const command = 'jest src/* -f -c d -a=b';

    const cli = parseCLI(command);

    expect(cli.command).toBe('jest');
    expect(cli.args).toStrictEqual(['src/*']);
    expect(cli.flags).toStrictEqual({ f: [], c: ['d'], a: ['b'] });
  });

  it('should be able to parse flags with quote', () => {
    const command = 'jest src/* --project=\'loremIpsumDolorSilAmet\' --foo "bar"';

    const cli = parseCLI(command);

    expect(cli.command).toBe('jest');
    expect(cli.args).toStrictEqual(['src/*']);
    expect(cli.flags).toStrictEqual({ project: ['loremIpsumDolorSilAmet'], foo: ['bar'] });
  });

  it('should be able to parse flags with multiple properly closed quotes', () => {
    const command = `jest src/* --complex='escaped\\'quote' -m=\"escaped\\\"quote\"`;

    const cli = parseCLI(command);

    expect(cli.command).toBe('jest');
    expect(cli.args).toStrictEqual(['src/*']);
    expect(cli.flags).toStrictEqual({ complex: [`escaped'quote`], m: [`escaped"quote`] });
  });

  it('should throw error when quote is not closed properly', () => {
    const command = `jest src/* -f 'as`;

    expect(() => parseCLI(command)).toThrowError(InvalidFlagError);
  });

  it('should throw error when there are multiple = in same flag', () => {
    const command = `jest src/* -f=foo=ss`;

    const cli = parseCLI(command);

    expect(cli.command).toBe('jest');
    expect(cli.args).toStrictEqual(['src/*']);
    expect(cli.flags).toStrictEqual({ f: ['foo=ss'] });
  });

  it('should allow equal sign in flag that is written without equal sign', () => {
    const command = `jest src/* -f foo=ss`;

    const cli = parseCLI(command);

    expect(cli.command).toBe('jest');
    expect(cli.args).toStrictEqual(['src/*']);
    expect(cli.flags).toStrictEqual({ f: ['foo=ss'] });
  });

  it('should allow equal sign without preceding values', () => {
    const command = `jest src/* --foo=`;

    const cli = parseCLI(command);

    expect(cli.command).toBe('jest');
    expect(cli.args).toStrictEqual(['src/*']);
    expect(cli.flags).toStrictEqual({ foo: [''] });
  });

  it('should throw error if CLI encounters positional arguments after flag', () => {
    const command = `jest src/* --foo=bar dist/*`;

    expect(() => parseCLI(command)).toThrowError(InvalidFlagError);
  });
});
