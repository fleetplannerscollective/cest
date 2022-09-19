import fs from 'fs'
import File from 'types/fs/File'

const readdir = fs.promises.readdir
const stat = fs.promises.stat
const ts = '.test.ts'
const js = '.test.js'

const read = async (path: string): Promise<File[]> => {

    const ret: File[] = []

    let content: string[] = await readdir(path)

    for (let item of content) {
        let s: fs.Stats = await stat(path + '/' + item)

        if (s.isDirectory()) {
            ret.push(...await read(path + '/' + item))
        } else if (item.slice(-ts.length) === ts) {
            ret.push({
                name: path + '/' + item,
                type: 'ts'
            })
        } else if (item.slice(-js.length) === js) {
            ret.push({
                name: path + '/' + item,
                type: 'js'
            })
        }
    }

    return ret
}

export default read