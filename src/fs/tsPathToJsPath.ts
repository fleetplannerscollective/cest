import { basename, normalize } from 'path'

export default (tsPath: string, tsConfigPath: string, outDir: string): string => {
    const tsPathPieces = tsPath.split('/')
    const tsConfigPathPieces = tsConfigPath.split('/')

    tsPathPieces.pop() // remove filename from path

    while (
        tsConfigPathPieces.length && 
        tsPathPieces.length && 
        tsPathPieces[0] === tsConfigPathPieces[0]
    ) {
        tsPathPieces.shift()
        tsConfigPathPieces.shift()
    }

    const tsPathStub = tsPathPieces.join('/')

    return normalize(tsConfigPath + '/' + outDir + '/' + tsPathStub + '/' + basename(tsPath, '.ts') + '.js').replace(/\\/g, '/')
}