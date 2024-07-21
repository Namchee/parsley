/**
 * InvalidFlagError
 *
 * This error will be thrown when the parses encounters
 * invalid flags, such as unclosed / mismatched quotes
 * or having positional arguments after flags
 */
export class InvalidFlagError extends Error {
  constructor(flag: string) {
    super(`Invalid value for flag '${flag}'`);
  }
}

/**
 * Base CLI command anatomy
 *
 * @property {string} command The program that's called by this command
 * @property {string[]} args Command line arguments
 * @property {Record<string, string[]>} flags List of command line flags with their values
 */
export type CLICommand = {
  command: string;
  args: string[];
  flags: Record<string, string[]>;
};

function parseCLIFlags(flag: string): Record<string, string[]> {
  const args = [];
  let curr = '';
  let isInQuotes = false;
  let quoteChar = '';

  for (let idx = 0; idx < flag.length; idx++) {
    const char = flag[idx];

    if (char === '\\' && idx + 1 < flag.length) {
      curr += flag[idx + 1];
      idx++;
    } else if (isInQuotes) {
      if (char === quoteChar) {
        isInQuotes = false;
      } else {
        curr += char;
      }
    } else {
      if (char === '"' || char === "'") {
        isInQuotes = true;
        quoteChar = char;
      } else if (char === ' ') {
        if (curr.length > 0) {
          args.push(curr);
          curr = '';
        }
      } else {
        curr += char;
      }
    }
  }

  if (isInQuotes) {
    throw new InvalidFlagError(curr);
  }

  if (curr.length > 0) {
    args.push(curr);
  }

  const result: Record<string, string[]> = {};

  args.forEach(arg => {
    let match = arg.match(/^--([^=]+)=(.*)$/);
    if (!match) {
      match = arg.match(/^-([^=])=(.*)$/);
    }

    if (match) {
      const key = match[1];
      let value = match[2];
      if (!result[key]) {
        result[key] = [];
      }

      result[key].push(value);
    } else {
      let standaloneMatch = arg.match(/^--(.+)$/);
      if (!standaloneMatch) {
        standaloneMatch = arg.match(/^-(.+)$/);
      }
      if (standaloneMatch) {
        const key = standaloneMatch[1];
        if (!result[key]) {
          result[key] = [];
        }
      } else {
        throw new InvalidFlagError(arg);
      }
    }
  });

  return result;
}

/**
 * Parse CLI command expressed as a string
 *
 * @param {string} cli CLI command written in string, including
 * their args and flags
 * @returns {CLICommand} Parsed CLI command
 */
export function parseCLI(cli: string): CLICommand {
  const tokens = cli.split(/\s+/);

  const command = tokens[0];
  const args = [];

  let idx = 1;

  while (!tokens[idx].startsWith('-')) {
    args.push(tokens[idx++]);
  }

  return {
    command,
    args,
    flags: parseCLIFlags(tokens.slice(idx).join(' ')),
  }
}
