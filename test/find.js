#!/usr/bin/env node

let input = ''

process.stdin.on('data', data => {
  input += data
})

process.stdin.on('close', () => {
  process.stdout.write(input)
  if (!input.includes(process.argv[2])) {
    process.exit(1)
  }
})
