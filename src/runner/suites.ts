import Suite from "types/runner/Suite"

const suites: Suite[] = []

export default {
    multiSuite: false,
    push: (suite: Suite) => {
        suites.push(suite)
    },
    pop: (): Suite | undefined => {
        return suites.pop()
    }
}