import chalk from "chalk";
import Result from "types/runner/Result";

export default (results: Result[]): string => {
    let totalTests = 0
    let totalPassed = 0

    for (let result of results) {
        totalTests += result.numTests
        totalPassed += result.numPassed

        if (result.errors.length) {
            process.stdout.write('\n' + result.errors.join('\n'))
        }
    }

    if (totalPassed === totalTests) {
        return chalk.green(`Summary: ${totalPassed}/${totalTests}\n`)
    } else {
        return chalk.red(`Summary: ${totalPassed}/${totalTests}\n`)
    }
}