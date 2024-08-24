import { equal } from 'node:assert'
import { test } from 'node:test'

test('one', () => {
  equal(1, 1)
})

test('two', () => {
  equal(2, 2)
})

test('env', () => {
  process.stdout.write(`NODE_ENV=${process.env.NODE_ENV}\n`)
})
