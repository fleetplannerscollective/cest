import TestFn from "./TestFn";

type Fn = (testName: string, fn: TestFn) => void

export default interface SiteBuilder extends Fn {
    run: () => Promise<boolean>
}