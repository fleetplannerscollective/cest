const cwd = process.cwd().replace(/\\/g, '/')
const fileCwd = 'file://' + cwd

export default (jsPath: string): string => {
    return fileCwd + '/' + jsPath
}