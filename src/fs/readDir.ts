import fs from 'fs'

const readdir = fs.promises.readdir
const stat = fs.promises.stat
const ts = '.ts'

const read = async (path: string): Promise<string[]> => {

    const ret: string[] = []

    let content: string[] = await readdir(path)

    for (let item of content) {
        let s: fs.Stats = await stat(path + '/' + item)

        if (s.isDirectory()) {
            ret.push(...await read(path + '/' + item))
        } else if (item.slice(-ts.length) === ts) {
            ret.push(path + '/' + item)
        }
    }

    return ret
}

export default read