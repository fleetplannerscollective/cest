import runner from "runner/runner"
import CliArguments from "types/cli/CliArguments"
import RunnerOptions from "types/runner/RunnerOptions"
import fastGlob from 'fast-glob'
import loadCestConfig from "./loadCestConfig"

export default async (argv: CliArguments) => {
    const options: RunnerOptions = await loadCestConfig(process.cwd())
    const tests = await fastGlob(options.include, {cwd: options.cwd, onlyFiles: true})

    const pass = await runner(tests, options)

    if (!pass) {
        process.exitCode = 1
    }
}