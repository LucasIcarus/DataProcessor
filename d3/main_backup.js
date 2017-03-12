const jsons = [
    '../json/500-1-400.json',
    '../json/500-2-400.json',
    '../json/500-3-400.json',
    '../json/500-4-400.json',
    '../json/500-5-400.json',
]



const Distances = ['5μm', '10μm', '15μm', '20μm', '30μm', '40μm']

const Xs = Distances.map((d, i) => {
    return {
        value: Math.log((+d.replace(/μm/, '') + 150) / 150),
        dis: +Distances[i].replace(/μm/, '') + 150
    }
})

let margin = { top: 40, right: 40, bottom: 40, left: 40 },
    width = 1000 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

jsons.map((src) => {
    d3.json(src, (json) => {
        const data = json.dataObjArr
        const yDomain = Math.round(Math.abs(data[0].Amps[0] / 2 * 10000)) / 10
        const resists = data.map((o, index) => {
            return {
                name: Distances[index],
                value: o.Resis.toFixed(1)
            }
        })
        const yDomain_2 = Math.ceil(resists[5].value / 1000) * 1000
        let y = d3.scaleLinear().domain([0, yDomain_2]).range([height, 0])
        let x = d3.scaleLinear().domain([0, Math.log(200 / 150)]).range([0, width])
        let svg = d3.select("body").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        svg.append("g")
            .attr("transform", "translate(50, 0)")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft().scale(y))
        svg.append('text')
            .attr('class', 'label-y label')
            .attr('text-anchor', 'start')
            .attr('x', 55)
            .attr('y', 14)
            .text('电阻(Ω)')
        svg.append("g")
            .attr("transform", "translate(50," + height + ")")
            .attr("class", "axis axis--x")
            .call(d3.axisBottom().scale(x).tickValues([]))
        svg.append("g")
            .selectAll('.ticks-x')
            .data(Xs).enter()
            .append('line')
            .attr("stroke", "black")
            .attr("stroke-width", "1px")
            .attr("x1", (d, i) => x(d.value) + 50)
            .attr("y1", height)
            .attr("x2", (d, i) => x(d.value) + 50)
            .attr("y2", height - 6)
        Xs.map(p => {
            svg.append('text')
                .attr("class", "x-label")
                .attr('text-anchor', 'middle')
                .attr('x', x(p.value) + 50)
                .attr('y', height + 20)
                .text('ln(' + p.dis + '/150)')
        })
        svg.append('text')
            .attr('class', 'label-x label')
            .attr('text-anchor', 'end')
            .attr('x', width + 40)
            .attr('y', height - 6)
            .text('ln(rn/r0)')
        svg.append("g")
            .selectAll('.point')
            .data(resists).enter()
            .append('circle')
            .attr("class", ".point_circle")
            .attr("fill", (d, i) => d3.schemeCategory10[i])
            .attr("cx", (d, i) => x(Xs[i].value) + 50)
            .attr("cy", (d, i) => y(d.value))
            .attr("r", 5)
        let y_mini = d3.scaleLinear().domain([0, yDomain]).range([height - 50, height / 2 - 30])
        let x_mini = d3.scaleLinear().domain([0, 1]).range([width / 2 + 70, width])
        svg.append("g")
            .attr("transform", "translate(" + (width / 2 + 70) + ", 0)")
            .attr("class", "axis axis-mini axis-y-mini")
            .call(d3.axisLeft().scale(y_mini).ticks(6))
        svg.append('text')
            .attr('class', 'label-y-mini label')
            .attr('text-anchor', 'start')
            .attr('x', width / 2 + 77)
            .attr('y', height / 2 - 20)
            .text('电流(mA)')
        svg.append("g")
            .attr("transform", "translate(0, " + (height - 50) + ")")
            .attr("class", "axis axis-mini axis-x-mini")
            .call(d3.axisBottom().scale(x_mini).ticks(6))
        svg.append('text')
            .attr('class', 'label-x-mini label')
            .attr('text-anchor', 'end')
            .attr('x', width)
            .attr('y', height - 60)
            .text('电压(V)')
        const getendPoint = function(slope) {
            let x, y
            if (1 / slope > yDomain) {
                y = yDomain,
                    x = yDomain * slope
            } else {
                x = 1
                y = 1 / slope
            }
            return { x, y }
        }
        var line = d3.line()
            .defined(function(d) { return d })
            .x(function(d) { return x_mini(d.x) })
            .y(function(d) { return y_mini(d.y) })

        data.map((o, i) => {
            let iv = []
            for (let i = 0; i < o.Amps.length; i++) {
                iv.push({ x: o.Volts[i], y: o.Amps[i] * 1000 })
            }
            iv = iv.filter(function(d) { return Math.abs(d.y) <= yDomain && d.x >= 0 })
            const endPoint = getendPoint(o.Resis / 1000)
            svg.selectAll(`.dot-${i}`)
                .data(iv)
                .enter().append("circle")
                .attr("fill", d3.schemeCategory10[i])
                .attr("class", `dot-${i}`)
                .attr("cx", d => x_mini(d.x))
                .attr("cy", d => y_mini(d.y))
                .attr("r", 3);
            svg.datum(iv).append('path')
                .attr("class", "line")
                .attr("d", line)
                .attr("stroke", d3.schemeCategory10[i])
                .attr("stroke-width", "1px")
        })
    })
})
