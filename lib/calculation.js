const { log, PI, sqrt } = Math

const _xs = [155, 160, 165, 170, 180, 190]

const xs = _xs.map((x) => {
    return log(x / 150)
})

const xs_1 = _xs.map(x => x - 149.35)

const ys_0 = [856, 1276, 1977, 2162, 3299, 4445]
const ys_1 = [2212, 2706, 3214, 3470, 4448, 5049]
const ys_2 = [2202, 2594.5, 3179.5, 3494.5, 4431, 5117.5]


const sum = function(arr) {
    return res = arr.reduce((prev, curr) => {
        return prev + curr
    })
}

const squareSum = function(arr) {
    return sum(arr.map(x => { return x * x }))
}

const average = function(arr) {
    return sum(arr) / arr.length
}

const linearFit = function(xs, ys) {
    const xys = xs.map((x, index) => {
        return x * ys[index]
    })
    const [averageX, averageY] = [average(xs), average(ys)]
    const N = xs.length
    const a = (squareSum(xs) * sum(ys) - sum(xs) * sum(xys)) / (N * squareSum(xs) - sum(xs) * sum(xs))
    const b = (N * sum(xys) - sum(xs) * sum(ys)) / (N * squareSum(xs) - sum(xs) * sum(xs))
    const r = (sum(xs.map((x, index) => ((x - averageX) * (ys[index] - averageY))))) / (sqrt(squareSum(xs.map(x => x - averageX))) * sqrt(squareSum(ys.map(y => y - averageY))))
    return [a, b, r * r]
}

const resistent = function(xs, ys) {
    const [a, b, r2] = linearFit(xs, ys)
    const Lt = (a / b) * 75 / 10000
    const Rs = b * 2 * PI
    return {
        a,
        b,
        r2,
        Lt,
        Rs,
        resis: Rs * Lt * Lt
    }
}

const gradient = function(xs, ys) {
    const xys = xs.map((x, index) => {
        return x * ys[index]
    })
    return squareSum(xs) / sum(xys)
}

const smoothCoefficients = {
    "linear": {
        "3": [
            [5, 2, -1, 6],
            [1, 1, 1, 3]
        ],
        "5": [
            [3, 2, 1, 0, -1, 5],
            [4, 3, 2, 1, 0, 10],
            [1, 1, 1, 1, 1, 5]
        ],
        "7": [
            [13, 10, 7, 4, 1, -2, -5, 28],
            [5, 4, 3, 2, 1, 0, -1, 14],
            [7, 6, 5, 4, 3, 2, 1, 28],
            [1, 1, 1, 1, 1, 1, 1, 7]
        ]
    },
    "quadriatic": {
        "5": [
            [31, 9, -3, -5, 3, 35],
            [9, 13, 12, 6, -5, 35],
            [-3, 12, 17, 12, -2, 35]
        ],
        "7": [
            [32, 15, 3, -4, -6, -3, 5, 42],
            [5, 4, 3, 2, 1, 0, -1, 14],
            [1, 3, 4, 4, 3, 1, -2, 14],
            [-2, 3, 6, 7, 6, 3, -2, 21]
        ]
    },
    "cubic": {
        "5": [
            [69, 4, -6, 4, -1, 70],
            [2, 27, 12, -8, 2, 35],
            [-3, 12, 17, 12, -3, 35]
        ],
        "7": [
            [39, 8, -4, -4, 1, 4, -2, 42],
            [8, 19, 16, 6, -4, -7, 4, 42],
            [-4, 16, 19, 12, 2, -4, 1, 42],
            [-2, 3, 6, 7, 6, 3, -2, 21]
        ]
    }
}

const smooth = (type, boxcar, arr) => {
    const length = arr.length
    if (length < boxcar) {
        return arr
    } else {
        const l = length - 1
        const num = (boxcar - 1) / 2
        const coefficients = smoothCoefficients[type][boxcar]
        const result = []
        const frontFactor = arr.slice(0, boxcar)
        const backFactor = arr.slice(length - boxcar, length).reverse()
        for (let i = 0; i < num; i++) {
            const spliter = coefficients[i][coefficients[i].length - 1]
            result[i] = frontFactor.reduce((a, b, index) => a + b * coefficients[i][index], 0) / spliter
            result[l - i] = backFactor.reduce((a, b, index) => a + b * coefficients[i][index], 0) / spliter
        }
        const coLast = coefficients[coefficients.length - 1]
        for (let i = num; i < length - num; i++) {
            const factor = arr.slice(i - num, i + num + 1)
            const spliter = coLast[coLast.length - 1]
            result[i] = factor.reduce((a, b, index) => a + b * coLast[index], 0) / spliter
        }
        return result
    }
}


module.exports = {
    linearFit,
    resistent,
    gradient,
    xs,
    ys_0,
    smooth
}
