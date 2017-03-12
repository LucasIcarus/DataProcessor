const path = require('path')

const ref = require('./json/500-5-400.json').dataObjArr[3].Resis

const magic = 7200 + Number((100 * Math.random()).toFixed(5))

console.log(magic)

const magicPath = path.resolve('./metaData/500-5-400/04.txt')

const { hackMetaData } = require('./hack.js')

hackMetaData(magicPath, ref, magic)
