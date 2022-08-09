import Test from "./Test";

export default interface Suite {
    name: string,
    tests: Test[],
    ready: Promise<void>
}