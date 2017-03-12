const fs = require('fs')
const path = require('path')
const readline = require('readline')
const {
    locateFile
} = require('./lib/iv')
const { smooth } = require('./lib/calculation.js')

const list = locateFile('./optical/metaData')

list.map(path => {
    const readStream = readline.createInterface({
        input: fs.createReadStream(path)
    })
    const wavelength = []
    const reflectivity = []
    readStream.on('line', line => {
        const arr = line.split("\t")
        if (arr[1]) {
            wavelength.push(+arr[0])
            reflectivity.push(1 - Number(arr[1]))
        }
    })
    readStream.on('close', () => {
        wavelength.reverse()
        reflectivity.reverse()
        const afterSmooth = smooth('linear', 7, smooth('linear', 7, reflectivity))
        const writeStream = fs.createWriteStream(path.replace(/metaData/, 'release').replace(/\.asc/, '.json'))
        let name = path.split('\\')
        name = name.pop().replace(/\.asc/, '')
        writeStream.write(JSON.stringify({ name, wavelength, reflectivity, afterSmooth }))
    })
})
