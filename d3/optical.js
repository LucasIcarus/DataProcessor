const jsons = [
    '../optical/release/1-500-1-400.json',
    '../optical/release/1-500-1.json',
    '../optical/release/3-500-5.json',
    '../optical/release/3-500-1-400.json',
    '../optical/release/1-500-5-400.json',
    '../optical/release/1-500-5.json',
    '../optical/release/3-500-5-400.json',
    '../optical/release/3-500-1.json',
]

const texts = [
    ['Ni(1nm)Ag(1nm), 退火1min',
    'Ni(1nm)Ag(1nm), 退火5min',
    'Ni(1nm)Ag(3nm), 退火1min',
    'Ni(1nm)Ag(3nm), 退火5min'],
    ['Ni(1nm)Ag(1nm), 退火1min',
    'Ni(1nm)Ag(1nm), 退火5min',
    'Ni(1nm)Ag(3nm), 退火1min',
    'Ni(1nm)Ag(3nm), 退火5min'],
]

const yTicks = ((num) => {
    const ticks = []
    let i = num
    while (i < 101) {
        ticks.push(i)
        i += 5
    }
    return ticks
})(70)

const xTicks = ((min, max) => {
    const ticks = []
    const interval = Math.ceil((max - min) / 50) * 10
    let i = min
    while (i < max) {
        ticks.push(i)
        i += interval
    }
    ticks.push(max)
    return ticks
})(400, 500)

const yMinors = yTicks.filter(x => x !== yTicks[0]).map(x => x - (yTicks[1] - yTicks[0]) / 2)

const xMinors = xTicks.filter(x => x !== xTicks[0]).map(x => x - (xTicks[1] - xTicks[0]) / 2)

let margin = { top: 40, right: 40, bottom: 160, left: 160 },
    width = 1020 - margin.left - margin.right,
    height = 760 - margin.top - margin.bottom;

const chart = []

jsons.map(src => {
    d3.json(src, json => {

        const data = json.wavelength.map((x, i) => {
            return {
                x,
                y: json.afterSmooth[i]
            }
        }).filter(obj => obj.x % 2 === 0 && obj.x <= 500)

        chart.push({ data, name: json.name })
    })
})

setTimeout(() => {
    const op = []
    op[0] = chart.slice(0, 4)
    op[1] = chart.slice(4, 8)
    op.map((p, index) => {
        // Main SVG
        const svg = d3.select("body").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

        // Draw Main Axis
        const y = d3.scaleLinear().domain([70, 100]).range([height, 0])
        const x = d3.scaleLinear().domain([400, 500]).range([0, width])

        const AxisMain = svg.append("g").attr("class", "axis-main")
        AxisMain.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft().scale(y).tickSize(-12, -12, 0).tickValues(yTicks).tickPadding(18))
        AxisMain.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft().scale(y).tickSize(-6, -6, 0).tickValues(yMinors).tickFormat(x => null))
        AxisMain.append("g")
            .attr("transform", `translate(${width}, 0)`)
            .attr("class", "axis axis--y")
            .call(d3.axisLeft().scale(y).tickSize(12, 12, 0).tickValues(yTicks).tickFormat(x => null))
        AxisMain.append("g")
            .attr("transform", `translate(${width}, 0)`)
            .attr("class", "axis axis--y")
            .call(d3.axisLeft().scale(y).tickSize(6, 6, 0).tickValues(yMinors).tickFormat(x => null))
        AxisMain.append("g")
            .attr("transform", `translate(0, ${height})`)
            .attr("class", "axis axis--x")
            .call(d3.axisBottom().scale(x).tickSize(-12, -12, 0).tickValues(xTicks).tickPadding(18))
        AxisMain.append("g")
            .attr("transform", `translate(0, ${height})`)
            .attr("class", "axis axis--x")
            .call(d3.axisBottom().scale(x).tickSize(-6, -6, 0).tickValues(xMinors).tickFormat(x => null))
        AxisMain.append("g")
            .attr("class", "axis axis--x")
            .call(d3.axisBottom().scale(x).tickSize(12, 12, 0).tickValues(xTicks).tickFormat(x => null))
        AxisMain.append("g")
            .attr("class", "axis axis--x")
            .call(d3.axisBottom().scale(x).tickSize(6, 6, 0).tickValues(xMinors).tickFormat(x => null))


        AxisMain.append("text")
            .attr('class', 'label-y label')
            .attr('text-anchor', 'middle')
            .attr('transform', 'rotate(-90)')
            .attr('x', -height / 2)
            .attr('y', -90)
            .text('反射率/%')
        AxisMain.append('text')
            .attr('class', 'label-x-mini label')
            .attr('text-anchor', 'middle')
            .attr('x', width / 2)
            .attr('y', height + 90)
            .text('波长/nm')

        // line
        const l = svg.append("g").attr("class", "line-total")
        const line = d3.line()
            .defined(function(d) { return d })
            .x(function(d) { return x(d.x) })
            .y(function(d) { return y(d.y * 100) })

        const symbolSign = d3.symbol()
            .type(d => d3.symbols[d])
            .size(d => 120)

        p.map((c, i) => {
            l.datum(c.data).append('path')
                .attr("class", "line")
                .attr("d", line)
                .attr("stroke", d3.schemeCategory10[i])
                .attr("stroke-width", "2px")
            l.selectAll(`.symbol-${i}`).data(c.data.filter((x, i) => i % 2 === 0))
                .enter().append('path')
                .attr('class', `.symbol-${i}`)
                .attr("transform", (d, i) => {
                    const tx = x(d.x),
                        ty = y(d.y * 100)
                    return `translate(${tx}, ${ty})`
                })
                .attr("fill", d3.schemeCategory10[i])
                .attr("d", symbolSign(i))
        })

        const sign = svg.append("g").attr("class", "sign")

        texts[index].map((str, i) => {
            const [w, h] = [width / 2, height * 2.8 / 4]
            sign.append("text")
                .attr("text-anchor", "start")
                .attr("x", w + 5)
                .attr("y", h + i * 40 + 10)
                .text(str)
            sign.append('path')
                .attr('transform', `translate(${w - 40}, ${h + i * 40})`)
                .attr('fill', d3.schemeCategory10[i])
                .attr('d', symbolSign(i))
            sign.append("line")
                .attr("stroke-width", "2px")
                .attr("stroke", d3.schemeCategory10[i])
                .attr("x1", w - 80)
                .attr("y1", h + i * 40)
                .attr("x2", w)
                .attr("y2", h + i * 40)
        })
    })
}, 1000)
