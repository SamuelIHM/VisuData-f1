let width = 1000
let height = 2000
const svg = d3.select("body").append("svg").attr("width", width).attr("height", height);


let drivers;
let constuctors;
let results;

const margin = ({top: 30, right: 0, bottom: 10, left: 30})

xAxis = g => g
    .attr("transform", `translate(0,${margin.top})`)
    .call(d3.axisTop(x).ticks(width / 80))
    .call(g => g.select(".domain").remove())

yAxis = g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).tickSizeOuter(0))


d3.csv('formula-1-race-data/drivers.csv').then(function(data){drivers = data});
d3.csv('formula-1-race-data/constructors.csv').then(function(data){constuctors = data});
d3.csv('formula-1-race-data/results.csv').then(function(data){results = data});