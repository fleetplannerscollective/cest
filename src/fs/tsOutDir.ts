import fs from 'fs'

const readFile = fs.promises.readFile

export default async (tsConfigPath: string): Promise<string> => {
    const tsConfig = JSON.parse(await readFile(tsConfigPath + '/tsconfig.json', 'utf-8'))
    return tsConfig.compilerOptions.outDir
}