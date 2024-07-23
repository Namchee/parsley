# Parsley

Parse CLI command, arguments, and flags from a string.

## Installation

You can install this package using your favorite package manager:

```bash
# Using npm
npm install @namchee/parsley

# Using yarn
yarn add @namchee/parsley

# Using pnpm
pnpm install @namchee/parsley

# Using bun
bun install @namchee/parsley
```

## API

### `parseCLI(command: string)`

Parse command line arguments from a string and extract the command, arguments, and flags.

### Parameter

- `command` - The CLI command you want to parse.

### Returns

- `CLICommand` - Extracted CLI command

### Throws

- `InvalidFlagError` - Thrown when the parser tries to parse invalid CLI command.

## Types

### `CLICommand`

Extracted CLI command including its arguments and flags. Returned by `parseCLI` function.

#### Properties

- `command` - The program that's called by this command
- `args` - Command line arguments
- `flags` - List of command line flags with their values

## Errors

### `InvalidFlagError`

Thrown when the parser encounters unclosed flag quotation or incorrect positional argument position, such as when the positional argument is provided *after* flag definition.

## FAQ

### What's the difference between this and `parseArgs` from `node:util`?

1. This package works in any environment that runs JavaScript
2. This package doesn't need pre-defined options to parse CLI command

### What's the difference between this and CLI builders

1. This package doesn't support pre-defined template other than flag aliases
2. This package doesn't automatically read your arguments and parse it, you must provide the command string to it.

TL;DR: This is a more primitive package of CLI builders that only support simple parsing of commands.

### Does this package support chained commands (e.g: `a && b`)?

No, split it yourself for now. However if there is a demand for it, I'll consider it.

### Does this package support nested commands (e.g: `a \`b\``)

Not at the moment. However if there is a demand for it, I'll consider it.

## License

This project is licensed under the [MIT License](./LICENSE)
