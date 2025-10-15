#!/usr/bin/env node

let input = ''

process.stdin.on('data', data => {
  input += data
})

process.stdin.on('close', code => {
  if (process.argv[3]) {
    let major = process.version.match(/v\d+\./)[1]
    if (process.argv[3].split(',').includes(major)) {
      if (code === 0) {
        process.stderr.write('No exit code 1 on non-supported Node.js')
        process.exit(1)
      }
    }
  }
  process.stdout.write(input)
  if (!input.includes(process.argv[2])) {
    process.exit(1)
  }
})
