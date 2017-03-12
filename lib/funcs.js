const path = require('path')
const fs = require('fs')

const exists = (path) => fs.existsSync(path) || path.existsSync(path)

const isFile = (path) => exists(path) && fs.statSync(path).isFile()

const isDir = (path) => exists(path) && fs.statSync(path).isDirectory()

module.exports = {
    isFile,
    isDir
}
