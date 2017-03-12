const {
    linearFit,
    resistent,
    gradient,
    xs,
    ys_0
} = require('./lib/calculation')

const data = require('./json/500-4.json')

const ys_1 = data.dataObjArr.map(x => x.Resis)

const factor = ys_1[0] / 20

const ys_2 = ys_1.map((x, index) => {
    return index > 4 ? (x - (5 - index) * 2 * factor) : (x - (7 - index) * factor)
})

console.log(ys_1)

console.log(resistent(xs, ys_1))

console.log(ys_2)

console.log(resistent(xs, ys_2))
