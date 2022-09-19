import sourceMapSupport from 'source-map-support'
import suites from './suites'
import runSuite from './runSuite'
import Result from 'types/runner/Result'
import summary from './summary'
import Suite from 'types/runner/Suite'
import chalk from 'chalk'
import prettyError from './prettyError'
import jsPathToImportPath from 'fs/jsPathToImportPath'
import readDir from 'fs/readDir'
import tsOutDir from "fs/tsOutDir"
import findTsConfig from "fs/findTsConfig"
import tsPathToJsPath from 'fs/tsPathToJsPath'
import File from 'types/fs/File'

sourceMapSupport.install()

const importPaths: string[] = []

export default async (path: string): Promise<boolean> => {
    suites.multiSuite = true

    const tsPaths: File[] = await readDir(path)
    const tsConfigPath  = await findTsConfig(path)
    let outDir: string | undefined
    if (tsConfigPath) {
        outDir = await tsOutDir(tsConfigPath)
    }

    const results: Result[] = []
    let allPassed = true

    for (let tsPath of tsPaths) {
        let jsPath: string

        if (tsPath.type === 'ts') {
            if (!tsConfigPath || !outDir) {
                throw new Error(`tsconfig.json not found`)
            }
            jsPath = tsPathToJsPath(tsPath.name, tsConfigPath, outDir)
        } else if (tsPath.type === 'js') {
            jsPath = tsPath.name
        } else {
            continue
        }

        const importPath: string = jsPathToImportPath(jsPath)

        if (importPaths.includes(importPath)) {
            process.stdout.write(chalk.gray(`${tsPath} -\n`))
            results.push({
                pass: true,
                errors: [],
                numTests: 1,
                numPassed: 1
            })
            continue
        } else {
            importPaths.push(importPath)
        }

        let suite: Suite | undefined
        try {
            await import(importPath)
            suite = suites.pop()
        } catch (err) {
            process.stdout.write(chalk.red(`${tsPath} failed import\n`))

            if (!(err instanceof Error)) {
                err = new Error(String(err))
            }

            results.push({
                pass: false,
                errors: [prettyError(tsPath.name, '', '', err as Error)],
                numTests: 1,
                numPassed: 0
            })
            allPassed = false
            continue
        }

        if (!suite) {
            process.stdout.write(chalk.red(`${tsPath} empty suite\n`))
            results.push({
                pass: false,
                errors: [],
                numTests: 1,
                numPassed: 0
            })
            allPassed = false
            continue
        }

        try {
            await suite.ready
        } catch (err) {
            process.stdout.write(chalk.red(`${tsPath} suite timeout`))
            results.push({
                pass: false,
                errors: [],
                numTests: 1,
                numPassed: 0
            })
            allPassed = false
            continue
        }

        if (!suite.tests.length) {
            process.stdout.write(chalk.red(`${tsPath} empty suite\n`))
            results.push({
                pass: false,
                errors: [],
                numTests: 1,
                numPassed: 0
            })
            allPassed = false
            continue
        }
        
        const result = await runSuite(tsPath.name, suite)

        if (result.errors.length) allPassed = false

        results.push(result)
    }

    process.stdout.write('\n' + summary(results) + '\n')

    return allPassed
}
