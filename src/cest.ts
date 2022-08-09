import sourceMapSupport from 'source-map-support'
import TestFn from 'types/TestFn'
import suites from 'runner/suites'
import Suite from 'types/runner/Suite'
import SuiteBuilder from 'types/SuiteBuilder'
import runSuite from 'runner/runSuite'
import summary from 'runner/summary'

sourceMapSupport.install()

export default (suiteName: string) => {
    let resolveReady: () => void | undefined
    let rejectReady: () => void | undefined
    const suite: Suite = {
        name: suiteName,
        tests: [],
        ready: new Promise((resolve, reject) => {
            resolveReady = resolve
            rejectReady = reject
        })
    }

    suites.push(suite)
    const ret: SuiteBuilder = (name: string, fn: TestFn) => {
        suite.tests.push({ name: name, fn: fn })
    }

    const timeout = setTimeout(() => {
        rejectReady()
    }, 2000)

    ret.run = async (): Promise<boolean> => {
        clearTimeout(timeout)
        resolveReady()

        if (suites.multiSuite) return true

        const result = await runSuite('', suite)

        process.stdout.write('\n' + summary([result]) + '\n')

        return result.pass
    }

    return ret
}

