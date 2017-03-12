const {
    locateFile
} = require('./lib/iv')

const fs = require('fs')

const { join, resolve } = require('path')

const list = fs.readdirSync('./hack').map(p => {
    return locateFile(resolve('./hack', p))
})

list.map(arr => {
    arr.map(p => {
        const { atime, ctime, mtime } = fs.statSync(p.replace(/hack/, 'metaData'))
        fs.utimesSync(p, atime, mtime)
    })
})
