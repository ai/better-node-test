import { equal } from 'node:assert'
import { test } from 'node:test'

setInterval(() => {}, 1000)

test('hang', () => {
  equal(1, 1)
})
