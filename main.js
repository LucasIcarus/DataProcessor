const fs = require('fs')
const { resolve } = require('path')
const { isDir } = require('./lib/funcs')
const { process, generateTxt } = require('./lib/iv')
const { linearFit, resistent, gradient, xs, ys_0 } = require('./lib/calculation')



const release = resolve(__dirname, './release')

const releaseList = (path = release) => {
    let list = fs.readdirSync(path)
    list = list.map((p) => {
        p = resolve(path, p)
        return isDir(p) ? releaseList(p) : p
    })
    return list
}

const dataList = releaseList()

let i = 0

dataList.map(dataGroup => {
    Promise.all(dataGroup.map(path => {
        return process(path)
    })).then((IVArr) => {
        return IVArr.map(iv => {
            return { name: iv.name, Amps: iv.Amps, Volts: iv.Volts, Resis: gradient(iv.Volts, iv.Amps) }
        })
    }).then((dataObjArr) => {
        const resisArr = []
        dataObjArr.map(obj => {
            resisArr.push(obj.Resis)
        })
        const resistivity = resistent(xs, resisArr)
        console.log(`name: ${dataObjArr[0].name} \n resistivity: ${resistivity.resis}`)
        fs.writeFileSync(`./json/${dataObjArr[0].name}.json`, JSON.stringify({ dataObjArr, resistivity }, null, 2) + '\n')
    })
})
