import fs from 'fs'
import { dirname } from 'path'

const stat = fs.promises.stat

export default async (path: string): Promise<string> => {

    let found = false
    let p = path
    while (p.length > 0) {
        try {
            const s = await stat(p + '/tsconfig.json')
            if (s.isFile()) {
                found = true
                break
            }
        } catch (err) {
            // ignore error
        }
        if (dirname(p) === p) {
            break
        }
        p = dirname(p)
    }

    if (!found) {
        throw new Error(`tsconfig.json not found`)
    }

    return p
}