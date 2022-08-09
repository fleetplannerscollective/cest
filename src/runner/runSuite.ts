import chalk from 'chalk'
import prettyError from './prettyError'
import Suite from 'types/runner/Suite'
import Result from 'types/runner/Result'

export default async (fileName: string, suite: Suite): Promise<Result> => {

    const result: Result = {
        pass: true,
        errors: [],
        numTests: 0,
        numPassed: 0
    }

    process.stdout.write(chalk.gray(suite.name + ' '))
    for (const test of suite.tests) {
        result.numTests += 1

        try {
            await test.fn()
            process.stdout.write(chalk.gray('•'))
            result.numPassed += 1
        } catch (err) {
            process.stdout.write(chalk.red('X'))

            if (!(err instanceof Error)) {
                err = new Error(String(err))
            }

            result.errors.push(prettyError(fileName, suite.name, test.name, err as Error))
            result.pass = false
        }
    }

    if (result.pass) {
        process.stdout.write(chalk.green(` ${result.numPassed}/${result.numTests}\n`))
    } else {
        process.stdout.write(chalk.red(` ${result.numPassed}/${result.numTests}\n`))
    }

    return result
}
