#!/usr/bin/env node

import runner from "runner/runner"

let path = '.'
if (process.argv.length > 2) {
    path = process.argv[2]
}

const pass = await runner(path)

if (!pass) {
    process.exitCode = 1
}
