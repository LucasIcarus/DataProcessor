const fs = require('fs')
const readline = require('readline')
const { join, resolve } = require('path')
const { isFile, isDir } = require('./funcs')

const root = __dirname
const metaData = resolve(root, '../metaData')
const release = resolve(root, '../release')

const locateFile = (path = metaData) => {
    let list = fs.readdirSync(path)
    list = list.map((p) => {
        p = resolve(path, p)
        if (isDir(p)) {
            fs.mkdirSync(p.replace(/metaData/, 'release'))
            return locateFile(p)
        }
        return p
    })
    return list
}

const processMetadata = function(path) {
    const readStream = readline.createInterface({
        input: fs.createReadStream(path)
    })
    const writeStream = fs.createWriteStream(path.replace(/metaData/, 'release'))
    readStream.on('line', (line) => {
        const arr = line.split(',')
        if ((!Number.isNaN(Number(arr[0]))) && (Number(arr[0]) !== 0)) {
            const iv = []
            iv.push(arr.pop())
            iv.push(arr.pop())
            writeStream.write(iv.reverse().join('||') + '\n')
        }
    })
}

const generateTxt = () => {
    const fileArr = locateFile()
    for (let i = 0, len = fileArr.length; i < len; i++) {
        fileArr[i].map(processMetadata)
    }
}

const process = (path) => new Promise((resolve, reject) => {
    const name = path.replace(/.*release\//, '').replace(/\/[^/]+$/, '')
    const readStream = readline.createInterface({
        input: fs.createReadStream(path)
    })
    const Volts = [],
        Amps = []
    let arr
    readStream.on('line', line => {
        arr = line.split('||').map(x => Number(x))
        Volts.push(arr[0])
        Amps.push(arr[1])
    })
    readStream.on('close', () => {
        resolve({ Volts, Amps, name })
    })
})

module.exports = {
    locateFile,
    processMetadata,
    generateTxt,
    process
}
