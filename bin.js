#!/usr/bin/env node

import { spawn } from 'node:child_process'
import { lstat, readdir } from 'node:fs/promises'
import { join } from 'node:path'

let base = ['--test', '--test-reporter', 'spec']
let env = { ...process.env }

const IGNORE = new Set(['.git', 'node_modules'])

async function findFiles(dir, filter) {
  let found = []
  for (let name of await readdir(dir)) {
    if (IGNORE.has(name)) continue
    let filename = join(dir, name)
    let stat = await lstat(filename)
    if (stat.isDirectory()) {
      found.push(...(await findFiles(filename, filter)))
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
      '  -t <pattern>                 Run tests matching pattern\n' +
      '  --coverage <threshold>       Set coverage lines threshold\n' +
      '  --coverage-include <pattern> Include files to test coverage\n' +
      '  --coverage-exclude <pattern> Exclude files from test coverage\n'
  )
}

function checkNodeVersion(minMinor, minPatch) {
  let match = process.version.match(/v(\d+)\.(\d+)\./)
  let minor = parseInt(match[1])
  let patch = parseInt(match[2])
  if (minMinor < minor) {
    return true
  } else if (minMinor === minor) {
    return minPatch <= patch
  } else {
    return false
  }
}

let args = []
let files = []

let debugMode = false

let hasExperimental = false
function experimentalArg(...list) {
  if (!hasExperimental) {
    hasExperimental = true
    return ['--disable-warning=ExperimentalWarning', ...list]
  } else {
    return list
  }
}

for (let i = 2; i < process.argv.length; i++) {
  let arg = process.argv[i]
  if (arg === '-t') {
    args.push(`--test-name-pattern=${process.argv[++i]}`)
  } else if (arg === '--coverage-include') {
    args.push(`--test-coverage-include`, process.argv[++i])
  } else if (arg === '--coverage-exclude') {
    args.push(`--test-coverage-exclude`, process.argv[++i])
  } else if (arg === '--coverage') {
    if (checkNodeVersion(22, 6)) {
      let threshold = process.argv[++i]
      args.push(
        ...experimentalArg(
          '--experimental-test-coverage',
          '--test-coverage-exclude',
          '"**/*.test.*"',
          '--test-coverage-exclude',
          '"**/test/**"',
          `--test-coverage-lines=${threshold}`
        )
      )
    } else {
      process.stderr.write('You need Node.js >= 22.8 to use test coverage\n')
      process.exit(1)
    }
  } else if (arg === '--help' || arg === '-h') {
    showHelp()
    process.exit(0)
  } else if (arg === '--debug') {
    debugMode = true
  } else {
    files.push(arg)
  }
}

if (files.length === 0) {
  files = await findFiles('.', /\.(test|spec)\.(js|ts)$/)
}

if (files.some(i => i.endsWith('.ts'))) {
  base.push(...experimentalArg('--experimental-strip-types'))
}

if (debugMode) {
  process.stdout.write(
    'NODE_ENV=test node ' + [...base, ...args, ...files].join(' ')
  )
}

spawn('node', [...base, ...args, ...files], {
  env: {
    ...env,
    NODE_ENV: 'test'
  },
  stdio: 'inherit'
}).on('exit', process.exit)
