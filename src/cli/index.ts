import meow from 'meow'

import run from './run'

const cli = meow(
  `
  Usage
    $ mokia <entry-file> [options]

  Options
    --host       -h     Set host, default to "localhost".
    --port       -p     Set port, default to 8080.
    --prefix            Set route prefix.
    --priority          Set priority url.
    --watch      -w     Watch input files.
    --silent     -s     Hide request logs.
    --debug             Enable debug mode.

  Example
    $ mokia index.ts
    $ mokia ./my-project --port 8080
`,
  {
    flags: {
      host: {
        type: 'string',
        alias: 'h'
      },
      port: {
        type: 'string',
        alias: 'p'
      },
      prefix: {
        type: 'string'
      },
      priority: {
        type: 'string'
      },
      watch: {
        type: 'boolean',
        alias: 'w'
      },
      silent: {
        type: 'boolean',
        alias: 's'
      },
      debug: {
        type: 'boolean'
      }
    }
  }
)

run(cli)
