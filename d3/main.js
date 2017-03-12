const jsons = [
    '../json/500-1.json',
    '../json/500-2.json',
    '../json/500-3.json',
    '../json/500-4.json',
    '../json/500-5.json',
    '../json/500-1-400.json',
    '../json/500-2-400.json',
    '../json/500-3-400.json',
    '../json/500-4-400.json',
    '../json/500-5-400.json'

]



const Distances = ['5μm', '10μm', '15μm', '20μm', '30μm', '40μm']

const Xs = Distances.map((d, i) => {
    return {
        value: Math.log((+d.replace(/μm/, '') + 150) / 150),
        dis: +Distances[i].replace(/μm/, '') + 150
    }
})

let margin = { top: 40, right: 40, bottom: 160, left: 160 },
    width = 900 - margin.left - margin.right,
    height = 670 - margin.top - margin.bottom;

const total = [[], []],
    change = [[], []]

jsons.map((src, position) => {
    d3.json(src, (json) => {
        const dataOrigin = json.dataObjArr
        const resists = dataOrigin.map((o, index) => {
            return {
                name: Distances[index],
                value: o.Resis.toFixed(1),
                index: index
            }
        })
        let yMainDomain = Math.ceil(resists[5].value / 1000) * 1000

        if (yMainDomain === 17000 || yMainDomain === 9000) {
            yMainDomain += 1000
        }

        const interval = num => num > 20000 ? 5000 : num >= 10000 ? 2000 : 1000

        const yMainTickValues = ((num) => {
            const tickValues = []
            let i = 0
            while (i <= num) {
                tickValues.push(i)
                i += interval(num)
            }
            return tickValues
        })(yMainDomain)

        const yMainMinors = yMainTickValues.filter(x => x != 0).map(y => y - interval(yMainDomain) / 2)

        const yMiniDomain = Math.round(Math.abs(dataOrigin[0].Amps[0] / 2 * 10000)) / 10

        const yMiniTicks = ((num) => {
            const tickValues = []
            let i = 0
            let interval
            switch (num) {
                case 0.1:
                    interval = 0.02
                    break
                case 0.2:
                case 0.3:
                    interval = 0.05
                    break
                case 0.4:
                case 0.7:
                    interval = 0.1
                    break
            }
            while (i <= num) {
                tickValues.push(i)
                i += interval
            }
            return tickValues
        })(yMiniDomain)

        // Main SVG
        const svg = d3.select("body").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")



        // Draw Main Axis
        const y = d3.scaleLinear().domain([0, yMainDomain]).range([height, 0])
        const x = d3.scaleLinear().domain([0, Math.log(200 / 150)]).range([0, width])

        const AxisMain = svg.append("g").attr("class", "axis-main")
        AxisMain.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft().scale(y).tickSize(-12, -12, 0).tickValues(yMainTickValues).tickPadding(12))

        AxisMain.append("g")
            .attr("class", "axis--minor axis--y")
            .call(d3.axisLeft().scale(y).tickSize(-6, -6, 0).tickValues(yMainMinors).tickFormat(() => null))

        AxisMain.append("g")
            .attr("transform", "translate(" + width + ", 0)")
            .attr("class", "axis axis--y")
            .call(d3.axisRight().scale(y).tickSize(-12, -12, 0).tickValues(yMainTickValues).tickFormat(x => null))

        AxisMain.append("g")
            .attr("transform", "translate(" + width + ", 0)")
            .attr("class", "axis--minor axis--y")
            .call(d3.axisRight().scale(y).tickSize(-6, -6, 0).tickValues(yMainMinors).tickFormat(() => null))

        AxisMain.append("g")
            .attr("transform", "translate(0," + height + ")")
            .attr("class", "axis axis--x")
            .call(d3.axisBottom().scale(x).tickValues(Xs.map(x => x.value)).tickSize(-12, -12, 0).tickFormat(x => null))

        AxisMain.append("g")
            // .attr("transform", "translate(0," + height + ")")
            .attr("class", "axis axis--x")
            .call(d3.axisBottom().scale(x).tickValues(Xs.map(x => x.value)).tickSize(12, 12, 0).tickFormat(x => null))

        // Draw Mini Axis
        const y_mini = d3.scaleLinear().domain([0, yMiniDomain]).range([height - 80, height / 2 - 30])
        const x_mini = d3.scaleLinear().domain([0, 1]).range([width / 2 + 30, width - 40])
        const AxisMini = svg.append("g").attr("class", "axis-mini")
        AxisMini.append("g")
            .attr("transform", "translate(" + (width / 2 + 30) + ", 0)")
            .attr("class", "axis axis-y-mini")
            .call(d3.axisLeft().scale(y_mini).tickValues(yMiniTicks).tickSize(-6, -6, 0).tickPadding(9))
        AxisMini.append("g")
            .attr("transform", "translate(0, " + (height - 80) + ")")
            .attr("class", "axis axis-x-mini")
            .call(d3.axisBottom().scale(x_mini).tickValues([0, .2, .4, .6, .8, 1.0]).tickSize(-6, -6, 0).tickPadding(9))

        // Text and sign part
        const text = svg.append("g").attr("class", "text_and_sign")
        text.append('text')
            .attr('class', 'label-y label')
            .attr('text-anchor', 'middle')
            .attr('transform', 'rotate(-90)')
            .attr('x', -height / 2)
            .attr('y', -120)
            .text('电阻/Ω')

        text.append("g")
            .attr("class", "mathjax")
            .attr("transform", `translate(${width/2 - 60}, ${height + 80}) scale(1.5)`)
            .append('text')
            .attr('class', 'label label-math')
            .text(() => "$\\ln{(\\frac{r_n}{r_0})}$")
        Xs.map(p => {
            text.append("g")
                .attr("class", "mathjax")
                .attr("transform", `translate(${x(p.value) - 40}, ${height + 10}) scale(1.1)`)
                .append('text')
                .attr("class", "x-label")
                .text(() => `$\\ln{(\\frac{${p.dis}}{150})}$`)
        })
        setTimeout(() => {
            MathJax.Hub.Config({
                tex2jax: {
                    inlineMath: [['$', '$'], ["\\(", "\\)"]],
                    processEscapes: true
                }
            })
            MathJax.Hub.Register.StartupHook("End", function() {
                setTimeout(() => {
                    svg.selectAll('.mathjax').each(function() {
                        var self = d3.select(this),
                            g = self.select('text>span>svg'),
                            gg = g._groups

                        if (gg[0][0] && gg[0][0].tagName === 'svg') {
                            g.remove();
                            self.append(function() {
                                return g.node()
                            })
                        }
                    })
                }, 1)
            })
            MathJax.Hub.Queue(["Typeset", MathJax.Hub, text.node()])
        }, 1)
        text.append('text')
            .attr('class', 'label-mini label')
            .attr('text-anchor', 'start')
            .attr('transform', 'rotate(-90)')
            .attr('x', -410)
            .attr('y', 370)
            .text('电流/mA')
        text.append('text')
            .attr('class', 'label-mini label')
            .attr('text-anchor', 'end')
            .attr('x', width / 4 * 3 + 40)
            .attr('y', height - 25)
            .text('电压/V')

        const sign = text.append("g").attr("class", "sign")
        const symbolSign = d3.symbol()
            .type(d => d3.symbols[d])
            .size(d => 120)

        sign.selectAll(".sign-line").data(Distances).enter()
            .append("line")
            .attr("stroke-width", "2px")
            .attr("stroke", (d, i) => d3.schemeCategory10[i])
            .attr("x1", (d, i) => 40)
            .attr("y1", (d, i) => 70 + i * 40)
            .attr("x2", (d, i) => 100)
            .attr("y2", (d, i) => 70 + i * 40)
        sign.selectAll(".sign-symbol").data(Distances).enter()
            .append("path")
            .attr("class", ".symbol_sign")
            .attr("fill", (d, i) => d3.schemeCategory10[i])
            .attr("transform", (d, i) => {
                const tx = 70,
                    ty = 70 + i * 40
                return `translate(${tx}, ${ty})`
            })
            .attr("d", (d, i) => symbolSign(i))
        sign.append("text")
            .attr("text-anchor", "middle")
            .attr("x", 170)
            .attr("y", 46)
            .text("(间距/μm)")
        sign.selectAll(".sign-text").data(Distances).enter()
            .append("text")
            .attr("text-anchor", "middle")
            .attr("x", 170)
            .attr("y", (d, i) => 80 + i * 40)
            .text(d => d.replace(/μm/, ''))

        // Draw the scatter
        const symbolMain = d3.symbol()
            .type(d => d3.symbols[d.index])
            .size(d => 200)
        svg.append("g").attr("class", "scatter")
            .selectAll('.point')
            .data(resists).enter()
            .append('path')
            .attr("class", ".symbol_scatter")
            .attr("fill", (d, i) => d3.schemeCategory10[i])
            .attr("transform", (d, i) => {
                const tx = x(Xs[i].value),
                    ty = y(d.value)
                return `translate(${tx}, ${ty})`
            })
            .attr("d", d => symbolMain(d))

        // Draw the iv line
        const IV = svg.append("g").attr("class", "IV-total")
        dataOrigin.map((o, i) => {
            let iv = []
            for (let i = 0; i < o.Amps.length; i++) {
                iv.push({ x: o.Volts[i], y: o.Amps[i] * 1000 })
            }
            iv = iv.filter(function(d) { return Math.abs(d.y) <= yMiniDomain && d.x >= 0 })

            const ivItem = IV.append("g").attr("class", `iv-${i}`)
            const symbol = d3.symbol()
                .type(d => d3.symbols[i])
                .size(d => 80)
            ivItem.selectAll(`.dot-${i}`)
                .data(iv)
                .enter().append("path")
                .attr("fill", d3.schemeCategory10[i])
                .attr("class", `dot-${i}`)
                .attr("transform", d => {
                    const tx = x_mini(d.x),
                        ty = y_mini(d.y)
                    return `translate(${tx}, ${ty})`
                })
                .attr("d", d => symbol(d))
            const line = d3.line()
                .defined(function(d) { return d })
                .x(function(d) { return x_mini(d.x) })
                .y(function(d) { return y_mini(d.y) })
            ivItem.datum(iv).append('path')
                .attr("class", "line")
                .attr("d", line)
                .attr("stroke", d3.schemeCategory10[i])
                .attr("stroke-width", "1px")
        })


        if (position < 5) {
            total[0].push(dataOrigin[2])
            change[0].push(json.resistivity.resis)
        } else {
            total[1].push(dataOrigin[2])
            change[1].push(json.resistivity.resis)
        }

        if (position === 9) {
            const tickVs = [[0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3], [0, 0.1, 0.2, 0.3, 0.4]]
            total.map((t, p) => {
                const svg = d3.select("body").append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                const yIVDomain = Math.ceil((Math.max(...t.map(x => Math.abs(x.Amps[0]))) * 10000 / 15) * 10) / 10

                const y = d3.scaleLinear().domain([0, yIVDomain]).range([height, 0])
                const x = d3.scaleLinear().domain([0, 1]).range([0, width])

                const Axis = svg.append("g").attr("class", "axis-main")

                Axis.append("g")
                    .attr("class", "axis axis--y")
                    .call(d3.axisLeft().scale(y).tickSize(-12, -12, 0).tickValues(tickVs[p]).tickPadding(12).tickFormat(x => x === 0 ? ' 0' : x))
                Axis.append("g")
                    .attr("class", "axis--minor axis--y")
                    .call(d3.axisLeft().scale(y).tickSize(-6, -6, 0).tickValues(tickVs[p].filter(x => x != 0).map(y => y - tickVs[p][1] / 2)).tickFormat(x => null))
                Axis.append("g")
                    .attr('transform', `translate(${width}, 0)`)
                    .attr("class", "axis axis--y")
                    .call(d3.axisLeft().scale(y).tickSize(12, 12, 0).tickValues(tickVs[p]).tickFormat(x => null))
                Axis.append("g")
                    .attr('transform', `translate(${width}, 0)`)
                    .attr("class", "axis--minor axis--y")
                    .call(d3.axisLeft().scale(y).tickSize(6, 6, 0).tickValues(tickVs[p].filter(x => x != 0).map(y => y - tickVs[p][1] / 2)).tickFormat(x => null))
                Axis.append("g")
                    .attr("transform", "translate(0," + height + ")")
                    .attr("class", "axis axis--x")
                    .call(d3.axisBottom().scale(x).tickValues([0, 0.2, 0.4, 0.6, 0.8, 1.0]).tickSize(-12, -12, 0).tickPadding(12).tickFormat(x => x === 0 ? ' 0' : x))
                Axis.append("g")
                    .attr("transform", "translate(0," + height + ")")
                    .attr("class", "axis axis--x")
                    .call(d3.axisBottom().scale(x).tickValues([0.1, 0.3, 0.5, 0.7, 0.9]).tickSize(-6, -6, 0).tickFormat(x => null))
                Axis.append("g")
                    .attr("class", "axis axis--x")
                    .call(d3.axisBottom().scale(x).tickValues([0.1, 0.3, 0.5, 0.7, 0.9]).tickSize(6, 6, 0).tickFormat(x => null))
                Axis.append("g")
                    .attr("class", "axis axis--x")
                    .call(d3.axisBottom().scale(x).tickValues([0, 0.2, 0.4, 0.6, 0.8, 1.0]).tickSize(12, 12, 0).tickFormat(x => null))
                Axis.append('text')
                    .attr('class', 'label-y label')
                    .attr('text-anchor', 'middle')
                    .attr('transform', 'rotate(-90)')
                    .attr('x', -height / 2)
                    .attr('y', -100)
                    .text('电流/mA')
                Axis.append('text')
                    .attr('class', 'label-x label')
                    .attr('text-anchor', 'middle')
                    .attr('x', width / 2)
                    .attr('y', height + 100)
                    .text('电压/V')
                Axis.append('text')
                    .attr('class', 'label-x label')
                    .attr('text-anchor', 'middle')
                    .attr('x', 170)
                    .attr('y', 60)
                    .text('退火时间/min')

                for (let i = 0; i < 5; i++) {
                    Axis.append('text')
                        .attr('class', 'label')
                        .attr('text-anchor', 'middle')
                        .attr('x', 170)
                        .attr('y', 100 + 40 * i)
                        .text(`${i+1}`)

                    Axis.append("line")
                        .attr("stroke-width", "2px")
                        .attr("stroke", d3.schemeCategory10[i])
                        .attr("x1", 80)
                        .attr("y1", 88 + i * 40)
                        .attr("x2", 140)
                        .attr("y2", 88 + i * 40)
                    const symbol = d3.symbol()
                        .type(d => d3.symbols[i])
                        .size(d => 150)

                    Axis.append("path")
                        .attr("class", ".symbol_sign")
                        .attr("fill", d3.schemeCategory10[i])
                        .attr("transform", () => {
                            const tx = 110,
                                ty = 88 + i * 40
                            return `translate(${tx}, ${ty})`
                        })
                        .attr("d", symbolSign(i))
                }

                const Lines = svg.append("g").attr("class", "lines")
                t.map((o, i) => {
                    let iv = []
                    for (let i = 0; i < o.Amps.length; i++) {
                        iv.push({ x: o.Volts[i], y: o.Amps[i] * 1000 })
                    }
                    iv = iv.filter(function(d) { return Math.abs(d.y) <= yIVDomain && d.x >= 0 })

                    const symbol = d3.symbol()
                        .type(d => d3.symbols[i])
                        .size(d => 200)
                    Lines.selectAll(`.dot-${i}`)
                        .data(iv)
                        .enter().append("path")
                        .attr("fill", d3.schemeCategory10[i])
                        .attr("class", `dot-${i}`)
                        .attr("transform", d => {
                            const tx = x(d.x),
                                ty = y(d.y)
                            return `translate(${tx}, ${ty})`
                        })
                        .attr("d", d => symbol(d))
                    const line = d3.line()
                        .defined(function(d) { return d })
                        .x(function(d) { return x(d.x) })
                        .y(function(d) { return y(d.y) })
                    Lines.datum(iv).append('path')
                        .attr("class", "line")
                        .attr("d", line)
                        .attr("stroke", d3.schemeCategory10[i])
                        .attr("stroke-width", "1px")
                })
            })

            const svg = d3.select("body").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            const y = d3.scaleLog().domain([0.0001, 1]).range([height, 0])
            const x = d3.scaleLinear().domain([0, 6]).range([0, width])

            const Axis = svg.append("g").attr("class", "axis-main")
            const yTicks = [0.0001, 0.001, 0.01, 0.1, 1]
            const minors = (() => {
                const ticks = []
                for (let j = 10000; j > 9; j = j / 10) {
                    for (let k = 2; k < 10; k++) {
                        ticks.push(k / j)
                    }
                }
                return ticks
            })()

            Axis.append("g")
                .attr("class", "axis axis--y")
                .call(d3.axisLeft().scale(y).tickValues([0.0001, 0.001, 0.01, 0.1, 1]).tickSize(-12, -12, 0).tickFormat(x => null))
            Axis.append("g")
                .attr("class", "axis--minor axis--y")
                .call(d3.axisLeft().scale(y).tickValues(minors).tickSize(-6, -6, 0).tickFormat(x => null))
            Axis.append("g")
                .attr("transform", `translate(${width}, 0)`)
                .attr("class", "axis axis--y")
                .call(d3.axisLeft().scale(y).tickValues(yTicks).tickSize(12, 12, 0).tickFormat(x => null))
            Axis.append("g")
                .attr("transform", `translate(${width}, 0)`)
                .attr("class", "axis--minor axis--y")
                .call(d3.axisLeft().scale(y).tickValues(minors).tickSize(6, 6, 0).tickFormat(x => null))
            Axis.append("g")
                .attr("transform", "translate(0," + height + ")")
                .attr("class", "axis axis--x")
                .call(d3.axisBottom().scale(x).tickValues([1, 2, 3, 4, 5]).tickFormat(x => x.toFixed(0)).tickSize(-12, -12, 0).tickPadding(12))
            Axis.append("g")
                .attr("class", "axis axis--x")
                .call(d3.axisBottom().scale(x).tickValues([1, 2, 3, 4, 5]).tickFormat(x => null).tickSize(12, 12, 0))
            Axis.append('text')
                .attr('class', 'label-x label-final')
                .attr('text-anchor', 'middle')
                .attr('x', width / 2)
                .attr('y', height + 80)
                .text('退火时间/min')
            Axis.append('line')
                .attr('stroke-width', '2px')
                .attr('stroke', d3.schemeCategory10[6])
                .attr('x1', width * 3 / 5)
                .attr('y1', height * 3 / 4)
                .attr('x2', width * 3 / 5 + 60)
                .attr('y2', height * 3 / 4)
            Axis.append('text')
                .attr('text-anchor', 'start')
                .attr('class', 'label-sign label-final')
                .attr('x', width * 3 / 5 + 80)
                .attr('y', height * 3 / 4 + 12)
                .text('一次退火')
            Axis.append('line')
                .attr('stroke-width', '2px')
                .attr('stroke', d3.schemeCategory10[7])
                .attr('x1', width * 3 / 5)
                .attr('y1', height * 3 / 4 + 60)
                .attr('x2', width * 3 / 5 + 60)
                .attr('y2', height * 3 / 4 + 60)
            Axis.append('text')
                .attr('text-anchor', 'start')
                .attr('class', 'label-sign label-final')
                .attr('x', width * 3 / 5 + 80)
                .attr('y', height * 3 / 4 + 72)
                .text('二次退火后')

            Axis.append("g")
                .attr("class", "mathjax-final")
                .attr("transform", `translate(${-110}, ${height/2 +120}) scale(1.5) rotate(-90)`)
                .append('text')
                .attr('class', 'label label-math')
                .text(() => "$接触电阻率/Ω$")
            Axis.append("g")
                .attr("class", "mathjax-final")
                .attr("transform", `translate(${-112}, ${height/2-70 }) scale(1.5) rotate(-90)`)
                .append('text')
                .attr('class', 'label label-math')
                .text(() => "$\\\\\\cdot cm^2$")

            yTicks.map((num, i) => {
                Axis.append("g")
                    .attr("class", "mathjax-final")
                    .attr("transform", `translate(${-60}, ${y(num) - 15})scale(1.3)`)
                    .append('text')
                    .attr("class", "x-label")
                    .text(() => `$10^{${i-4}}$`)
            })
            setTimeout(() => {
                MathJax.Hub.Config({
                    tex2jax: {
                        inlineMath: [['$', '$'], ["\\(", "\\)"]],
                        processEscapes: true
                    }
                })
                MathJax.Hub.Register.StartupHook("End", function() {
                    setTimeout(() => {
                        svg.selectAll('.mathjax-final').each(function() {
                            var self = d3.select(this),
                                g = self.select('text>span>svg'),
                                gg = g._groups

                            if (gg[0][0] && gg[0][0].tagName === 'svg') {
                                g.remove();
                                self.append(function() {
                                    return g.node()
                                })
                            }
                        })
                    }, 1)
                })
                MathJax.Hub.Queue(["Typeset", MathJax.Hub, text.node()])
            }, 1)
            change.map((c, order) => {

                const Line = svg.append("g").attr("class", "resis_line")
                const dots = c.map((r, i) => {
                    return {
                        x: i + 1,
                        y: r
                    }
                })
                const symbol = d3.symbol()
                    .type(d => d3.symbols[d])
                    .size(d => 200)
                Line.selectAll('dot-resis')
                    .data(dots).enter()
                    .append('path')
                    .attr("fill", (d, i) => d3.schemeCategory10[order + 6])
                    .attr("class", `dot-resis`)
                    .attr("transform", d => {
                        const tx = x(d.x),
                            ty = y(d.y)
                        return `translate(${tx}, ${ty})`
                    })
                    .attr("d", (d, i) => symbol(i))
                const l = d3.line()
                    .defined(function(d) { return d })
                    .x(function(d) { return x(d.x) })
                    .y(function(d) { return y(d.y) })
                Line.datum(dots).append('path')
                    .attr("class", "line")
                    .attr("d", l)
                    .attr("stroke", d3.schemeCategory10[order + 6])
                    .attr("stroke-width", "3px")
            })
        }
    })
})
