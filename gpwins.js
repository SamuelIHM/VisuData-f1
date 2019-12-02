let width = 1000
let height = 2000
const svg = d3.select("body").append("svg").attr("width", width).attr("height", height);


let drivers;
let results;
let winPerPilot;

const margin = ({top: 30, right: 0, bottom: 10, left: 30})

xAxis = g => g
    .attr("transform", `translate(0,${margin.top})`)
    .call(d3.axisTop(x).ticks(width / 80))
    .call(g => g.select(".domain").remove())

yAxis = g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).tickSizeOuter(0))


d3.csv('formula-1-race-data/drivers.csv').then(function(data){drivers = data});
d3.csv('formula-1-race-data/results.csv').then(function(data){
    results = data;
    let wins = results.filter(d=>{return d.position == 1;})
    winPerPilot = d3.nest()
        .key(d=>{return d.driverId;})
        .rollup(function(v) {return v.length;})
        .entries(wins)

    winPerPilot.forEach((row)=>{
        let result = drivers.filter(function(driver){
            return driver.driverId == row.key;
        })
        row.driverRef = result[0].driverRef
        row.nationality = result[0].nationality
    })

    winPerPilot.sort(function(x, y){
        return d3.descending(x.value, y.value);
    })

    let x = d3.scaleLinear()
        .domain([0, d3.max(winPerPilot, d => d.value)])
        .range([margin.left, width - margin.right-20])

    let y = d3.scaleBand()
        .domain(winPerPilot.map(d => d.driverRef))
        .range([margin.top, height - margin.bottom])
        .padding(0.1)


    svg.append("g")
        .attr("fill", "steelblue")
        .selectAll("rect")
        .data(winPerPilot)
        .join("rect")
        .attr("x", x(0))
        .attr("y", d => y(d.driverRef))
        .attr("width", d => x(d.value) - x(0))
        .attr("height", y.bandwidth());

    svg.append("g")
        .attr("fill", "white")
        .attr("text-anchor", "middle")
        .style("font", "12px sans-serif")
        .selectAll("text")
        .data(winPerPilot)
        .join("text")
        .attr("x", d => x(d.value) / 2 + 15)
        .attr("y", d => y(d.driverRef) + y.bandwidth() / 2)
        .attr("dy", "0.35em")
        .text(d => d.driverRef);

    svg.append("g")
        .attr("fill", "black")
        .attr("text-anchor", "after-edge")
        .style("font", "12px sans-serif")
        .selectAll("text")
        .data(winPerPilot)
        .join("text")
        .attr("x", d => x(d.value) + 5)
        .attr("y", d => y(d.driverRef) + y.bandwidth() / 2)
        .attr("dy", "0.35em")
        .text(d => d.value);

});

