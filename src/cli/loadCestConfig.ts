import RunnerOptions from "types/runner/RunnerOptions";

import fs from 'fs'
import { dirname, normalize } from "path";

const stat = fs.promises.stat
const readFile = fs.promises.readFile
const cestConfigName = 'cest.config.json'
const pkgName = 'package.json'
const driftName = 'drift'

const defaultOptions: RunnerOptions = {
    cwd: '',
    jsExtension: '.test.js',
    tsExtension: '.test.ts',
    tsOutDir: '',
    include: [
        '**/*.test.js',
        '**/*.test.ts'
    ]
}

export default async (cwd: string): Promise<RunnerOptions> => {
    let dir = cwd
    let rawConfig: string | undefined
    let done = false

    while (!done) {
        try {
            rawConfig = await readFile(dir + '/' + cestConfigName, { encoding: 'utf-8' })
            done = true
        } catch (err) {
            // do nothing
        }

        if (!rawConfig) {
            try {
                await stat(dir + '/' + pkgName)
                done = true
            } catch (err) {
                // do nothing
            }

            try {
                await stat(dir + '/' + driftName)
                done = true
            } catch (err) {
                // do nothing
            }
        }

        if (!done) {
            dir = dirname(dir)
        }
    }

    if (!rawConfig) {
        return Object.assign(defaultOptions, {cwd: cwd})
    } else {
        let config: RunnerOptions
        try {
            config = JSON.parse(rawConfig)
        } catch (err) {
            throw new Error('cest.config.json is not a valid json file')
        }

        if (config.tsOutDir) {
            config.tsOutDir = normalize(`${dir}/${config.tsOutDir}`).replace(/\\/g, '/')
        }

        config = Object.assign(defaultOptions, {cwd: cwd}, config)
        return config
    }
}