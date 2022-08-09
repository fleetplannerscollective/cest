import cest from 'cest'
import { strict as assert } from 'assert'

const test = cest('simpleTest')

test('passing test', () => {
    assert(true)
})

test('failing test', () => {
    assert(false)
})

test.run()