#!/usr/bin/env node

import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import run from './run'

yargs(hideBin(process.argv))
    .scriptName('cest')
    .usage('$0 <cmd> [args]')
    .command(
        '$0',
        'Cest. The javascript and typescript test runner for Cassie and associated projects.',
        run
    )
    .help()
    .argv