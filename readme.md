# Cest

Cest is a small and light test runner for typescript.

I got frustrated with how slow Jest was at running tests, so I made this. It's simple and works.

## Installation

`npm install cest`

## Write some tests

```
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
    'failing test', 
    () => {
        assert(false) // if the function throws an error, the test fails
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
```

## Run all tests

Use the cli tool:

`cest [path/to/ts/dir]`

Cest will identify all `.ts` files in the path, find `.tsconfig` locate the compiled `.js` files and run them.

## Run a single test suite without CLI

You can run a sinlge test suite by directly calling the `.js` file
`node mytest.js`

## Development

* Download the repo.
* Install dev dependencies.
* Run `npm run build`
* Run `npm run test`