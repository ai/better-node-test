import { equal } from 'node:assert'
import { test } from 'node:test'

import { one } from './foo.js'

test('one', () => {
  equal(one(), 1)
})

test('two', () => {
  equal(one() + one(), 2)
})
