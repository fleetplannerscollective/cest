import cest from 'cest' // import cest
import { strict as assert } from 'assert' // use the default assertion library from node

const test = cest('my test suite') // Create a suite

test(                // define a test
    'passing test',  // give the test a name
    () => {          // create a funtion to run the test
        assert(true) // if the function doesn't throw an error, the test passes
    }
)

test(
    'should throw', 
    () => {
        const t = () => {throw new Error()}
        assert.throws(t, Error) // For tests which should throw an error, use assert.throws, provided by node.js
    }
)

test(
    'async test', 
    async () => { // Cest handles async tests fine
        await new Promise((resolve) => {resolve(true)})
    }
)

test.run() // run all the tests