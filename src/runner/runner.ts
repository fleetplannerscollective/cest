import sourceMapSupport from 'source-map-support'
import suites from './suites'
import path from 'path'
import url from 'url'
import RunnerOptions from 'types/runner/RunnerOptions'
import runSuite from './runSuite'
import Result from 'types/runner/Result'
import summary from './summary'
import Suite from 'types/runner/Suite'
import chalk from 'chalk'
import prettyError from './prettyError'

sourceMapSupport.install()

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const importPaths: string[] = []

export default async (testPaths: string[], options: RunnerOptions): Promise<boolean> => {
    suites.multiSuite = true

    const root = options.cwd.replace(/\\/g, '/')
    const rootPieces = root.split('/')
    const outDirPieces = options.tsOutDir.split('/')

    let tsImportRoot: string
    let removeTsDirs = 0
    if (rootPieces.length > outDirPieces.length) {
        tsImportRoot = path.relative(__dirname, options.tsOutDir + '/' + rootPieces.slice(outDirPieces.length).join('/')).replace(/\\/g, '/')
    } else {
        tsImportRoot = path.relative(__dirname, options.tsOutDir).replace(/\\/g, '/')
        removeTsDirs = outDirPieces.length - rootPieces.length
    }

    const jsImportRoot = path.relative(__dirname, root).replace(/\\/g, '/')

    const results: Result[] = []
    let allPassed = true

    for (let testPath of testPaths) {
        let importPath: string

        if (testPath.slice(-options.tsExtension.length) === options.tsExtension) {
            let tsTestPath: string
            if (removeTsDirs) {
                tsTestPath = testPath.split('/').slice(removeTsDirs).join('/')
            } else {
                tsTestPath = testPath
            }
            importPath = `${tsImportRoot}/${tsTestPath.slice(0, -options.tsExtension.length) + options.jsExtension}`
        } else {
            importPath = `${jsImportRoot}/${testPath}`
        }

        if (importPaths.includes(importPath)) {
            process.stdout.write(chalk.gray(`${testPath} -\n`))
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
            process.stdout.write(chalk.red(`${testPath} failed import\n`))

            if (!(err instanceof Error)) {
                err = new Error(String(err))
            }

            results.push({
                pass: false,
                errors: [prettyError(testPath, '', '', err as Error)],
                numTests: 1,
                numPassed: 0
            })
            allPassed = false
            continue
        }

        if (!suite) {
            process.stdout.write(chalk.red(`${testPath} empty suite\n`))
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
            process.stdout.write(chalk.red(`${testPath} suite timeout`))
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
            process.stdout.write(chalk.red(`${testPath} empty suite\n`))
            results.push({
                pass: false,
                errors: [],
                numTests: 1,
                numPassed: 0
            })
            allPassed = false
            continue
        }
        
        const result = await runSuite(testPath, suite)

        if (result.errors.length) allPassed = false

        results.push(result)
    }

    process.stdout.write('\n' + summary(results) + '\n')

    return allPassed
}
