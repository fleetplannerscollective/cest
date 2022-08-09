export default interface Result {
    pass: boolean,
    errors: string[],
    numTests: number,
    numPassed: number
}