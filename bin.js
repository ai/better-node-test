import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import { lstat, readdir } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

let base = ['--test']
let env = { ...process.env }

const IGNORE = new Set(['.git', 'node_modules'])

async function findFiles(dir, filter, callback) {
  let found = []
  for (let name of await readdir(dir)) {
    if (IGNORE.has(name)) continue
    let filename = join(dir, name)
    let stat = await lstat(filename)
    if (stat.isDirectory()) {
      found.push(...(await findFiles(filename, filter, callback)))
    } else if (filter.test(name)) {
      found.push(filename)
    }
  }
  return found
}

function showHelp() {
  process.stdout.write(
    `Usage: bnt [options] [files]\n` +
      '\n' +
      'Options\n' +
      '  -t <pattern>  Run tests matching pattern\n'
  )
}

let args = []
let files = []
for (let i = 2; i < process.argv.length; i++) {
  let arg = process.argv[i]
  if (arg === '-t') {
    args.push(`--test-name-pattern=${process.argv[++i]}`)
  } else if (arg === '--help' || arg === '-h') {
    showHelp()
    process.exit(0)
  } else {
    files.push(arg)
  }
}

if (files.length === 0) {
  files = await findFiles('test', /\.test\.(js|ts)$/)
}

if (files.some(i => i.endsWith('.ts'))) {
  let loader
  if (typeof import.meta.resolve === 'function') {
    loader = fileURLToPath(await import.meta.resolve('tsm'))
    if (!existsSync(loader)) {
      process.stderr.write('Install `tsm` to run TypeScript tests\n')
      process.exit(1)
    }
  } else {
    loader = 'tsm'
  }
  base.push('--enable-source-maps', '--loader', loader)
  env.NODE_NO_WARNINGS = '1'
}

spawn('node', [...base, ...args, ...files], {
  env,
  stdio: 'inherit'
}).on('exit', process.exit)
