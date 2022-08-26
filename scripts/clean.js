import fs from 'fs'

const path = process.argv[2]

if (!path) {
    throw new Error("path argument not supplied")
}

fs.rm(path, {recursive: true}, (err) => {
    if (err) throw err
})
