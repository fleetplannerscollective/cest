import chalk from "chalk"


export default (fileName: string, suiteName: string, testName: string, err: Error): string => {
    let ret = ''
    if (fileName) {
        ret += chalk.gray('File: ') + chalk.cyan(fileName) + '\n'
    }
    if (suiteName) {
        ret += chalk.gray('Suite: ') + chalk.cyan(suiteName) + '\n'
    }
    if (testName) {
        ret += chalk.gray('Test:  ') + chalk.cyan(testName) + '\n'
    }
    
    const msg = err.stack
    if (!msg) {
        ret += chalk.yellow(err.toString())
        return ret
    }

    const i = msg.indexOf('\n')
    ret += chalk.yellow(msg.slice(0, i) + '\n')
    ret += chalk.gray(msg.slice(i) + '\n')

    return ret
}