#!/usr/bin/env node

import { spawn } from 'node:child_process'
import { lstat, readdir } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

let base = ['--test', '--test-reporter', 'spec']
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
  files = await findFiles('.', /\.(test|spec)\.(js|ts)$/)
}

if (files.some(i => i.endsWith('.ts'))) {
  let loader
  if (typeof import.meta.resolve === 'function') {
    let tsx, tsm
    try {
      tsx = import.meta.resolve('tsx')
    } catch {}
    try {
      tsm = import.meta.resolve('tsm')
    } catch {}
    if (tsx) {
      loader = fileURLToPath(tsx)
    } else if (tsm) {
      loader = fileURLToPath(tsm)
    } else {
      process.stderr.write('Install `tsx` to run TypeScript tests\n')
      process.exit(1)
    }
  } else {
    loader = 'tsx'
  }
  base.push('--enable-source-maps', '--loader', loader)
  env.NODE_NO_WARNINGS = '1'
}

spawn('node', [...base, ...args, ...files], {
  env,
  stdio: 'inherit'
}).on('exit', process.exit)
