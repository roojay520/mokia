import chalk = require('chalk')
import Debug from 'debug'
import meow from 'meow'
import ora = require('ora')
import path from 'path'
import clearModule from 'clear-module'

import { create, HOST, PORT, PREFIX, PRIORITY, ServerConfig, SILENT } from '../server'
import { debounce, log, getDependencies } from '../utils'
import FileWatcher from './file-watcher'

const isDev = process.env.NODE_ENV === 'development'

const debug = Debug('mokia:cli')
const cwd = process.cwd()
const spinner = ora()
const noop = () => {
  /* */
}

const tsOptions = {
  compilerOptions: {
    target: 'es6',
    module: 'commonjs',
    lib: ['dom', 'es2016', 'es2017'],
    strictPropertyInitialization: false,
    noUnusedLocals: false,
    moduleResolution: 'node',
    allowSyntheticDefaultImports: true,
    esModuleInterop: true,
    experimentalDecorators: true,
    emitDecoratorMetadata: true
  }
}

export default async function run (cli: meow.Result<any>) {
  const { input, flags } = cli
  const configPath = path.join(cwd, input[0] || 'index.ts')

  if (flags.debug) {
    Debug.enable('mokia:*')
  }

  debug('isDev', isDev)
  debug('configPath', configPath)
  debug('flag ', flags)

  if (/\.ts$/.test(configPath)) {
    debug('enable TypeScript...')
    require('ts-node').register(tsOptions)
  }

  const ignoreRegExp = isDev ? /node_modules|mokia[\/\\]+libs/ : /node_modules/

  try {
    let destroy = await start(configPath, flags)
    let dependencies = getDependencies(configPath, ignoreRegExp)
    debug('dependencies', dependencies)

    if (flags.watch) {
      const watcher = new FileWatcher()
      watcher.add(dependencies)

      watcher.on(
        'change',
        debounce(async (file: string) => {
          debug('file change', file)
          log(chalk.yellow('*'), 'Server is restarting...')
          spinner.start('Loading...\n')

          await destroy()
          debug('destroyed')
          dependencies.forEach((dep) => clearModule(dep))
          watcher.clear()

          destroy = await start(configPath, flags)
          dependencies = getDependencies(configPath, ignoreRegExp)
          watcher.add(dependencies)

          debug('dependencies', dependencies)
        }, 500)
      )
    }
  } catch (error) {
    spinner.fail(error.message)
    process.exit(1)
  }

  if (flags.version) cli.showVersion()
  if (flags.help) cli.showHelp()
}

async function start (configPath: string, options: any) {
  spinner.start('Loading...')

  let config: ServerConfig

  try {
    config = await import(configPath)
    if (config && config.default) config = (config as any).default
  } catch (error) {
    debug('error', error)
    spinner.fail(`Could not load: ${configPath}, waiting for change...`)
    return noop
  }

  if (options.host) config[HOST] = options.host
  if (options.port) config[PORT] = options.port
  if (options.prefix) config[PREFIX] = options.prefix
  if (options.silent) config[SILENT] = options.silent
  if (options.priority) config[PRIORITY] = options.priority

  const [port, destroy] = await create(config)
  spinner.succeed(`Server is listening on port ${chalk.green(port.toString())}.`)

  return destroy
}

process.on('unhandledRejection', (err) => {
  debug('unhandled rejection', err)
})
