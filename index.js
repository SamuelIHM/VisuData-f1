
let width = 800
let height = 400
const svg = d3.select("body").append("svg").attr("width", width).attr("height", height);

const MARGIN = 80
let maxTextLength = 100
const angleDegrees = -45
const angleRadians = angleDegrees * (Math.PI / 180)
const padding = 100
const t = svg.transition().duration(750)

let races;
let circuits;

d3.csv('formula-1-race-data/circuits.csv').then(function(data){circuits = data});
d3.csv('formula-1-race-data/races.csv').then(function(data){races = data});





var world = d3.json('https://gist.githubusercontent.com/olemi/d4fb825df71c2939405e0017e360cd73/raw/d6f9f0e9e8bd33183454250bd8b808953869edd2/world-110m2.json').then(
    function(data){
        const projection = d3.geoMercator()
            .center([0, 30])
            .scale(200)
            .rotate([0,0]);

        const path = d3.geoPath()
            .projection(projection);

        const g = svg.append("g");
        const g1 = svg.append("g");
        // world map
        g.selectAll("path")
            .data(topojson.feature(data, data.objects.countries).features)
            .enter()
            .append("path")
            .attr("d", path)
            .style('fill', '#999')

        // zoom and pan
        const zoom = d3.zoom()
            .on("zoom", () => {
                g.selectAll("path").attr("transform", d3.event.transform);
                g.selectAll("path")
                    .attr("d", path.projection(projection));
                g.selectAll("circle")
                    .attr("d", path.projection(projection));
            });

        path.projection(projection)


        let numberOfGpPerCircuit = d3.nest()
            .key(function(d) {return d.circuitId;})
            .rollup(function(v) {return v.length;})
            .entries(races);

        let gpPerCircuit = numberOfGpPerCircuit.forEach((row)=>{
            let result = circuits.filter(function(circuit){
                return circuit.circuitId == row.key;
            })
            row.lat = result[0].lat;
            row.lng = result[0].lng;
            row.name = result[0].name
        })


        //we create a function to scale the are of the circles. This is visually more accurate than scaling the circle radius.
        const scaleCircleAreaBuilder = (data) => {
            let maxValue = d3.max(data, d=>d.value)
            let maxCircleRadius = 30
            let maxCircleArea = Math.PI * Math.pow(maxCircleRadius,2)
            let circleAreaScale = d3.scaleLinear().domain([0,maxValue]).range([0,maxCircleArea])
            return function circleRadius(d) {
                let area = circleAreaScale(d)
                return Math.sqrt(area/Math.PI)
            }
        }

        let scaleArea = scaleCircleAreaBuilder(numberOfGpPerCircuit)

        numberOfGpPerCircuit.forEach(function(d){
            g.append("circle")
                .attr("cx", projection([d.lng, d.lat])[0])
                .attr("cy", projection([d.lng, d.lat])[1])
                .attr('r', scaleArea(d.value))
                .attr('opacity',0.5)
                .attr('fill', 'darkred')
                .attr("stroke", "#fff")
                .attr("stroke-width", 0.5)
        })

        svg.call(zoom)
        /*
        g.append("circle")
            .attr("cx", projection([144.968, -37.8497])[0])
            .attr("cy", projection([144.968, -37.8497])[1])
            .attr('r', 50)
            .attr('opacity',0.5)
            .attr('fill', 'darkred')
            .attr("stroke", "#fff")
            .attr("stroke-width", 0.5)*/
        /*g.selectAll("path")
            .data(gpPerCircuit)
            .join("circle")
            .attr("cx",d=>projection[d.long, d.lat][0])
            .attr("cy",d=>projection[d.long, d.lat][1])
            .attr('r', d=>(d.value))
            .attr('opacity',0.5)
            .attr('fill', 'darkred')
            .attr("stroke", "#fff")
            .attr("stroke-width", 0.5)*/
    });


   /* let co2perCountry = data
    let max2000 = d3.max(co2perCountry, d => d["2000"])
    //because we will animate from one bar chart to the other, our axis will go up to the maximum values considering the three years
    let maxValue = d3.max([d3.max(co2perCountry, d => d["2013"]), d3.max(co2perCountry, d => d["1990"]), max2000])
    const yscale = d3.scaleLinear().domain([0, maxValue]).range([height-MARGIN, MARGIN])

    //the xscale uses the scaleBand() function to assign to each categorial value of d.Pays a numerival value
    const xscale = d3.scaleBand()
        .rangeRound([0, width-MARGIN])
        .padding(0.1)

    xscale.domain([...co2perCountry].map((d) => d.Pays))

    // We now create both axis. We use the transform functions to translate them to the correct position
    const xaxis = d3.axisBottom().scale(xscale)
    const xaxis_container = svg.append("g")
        .attr("class", "xAxis")
        .attr("transform", `translate(${MARGIN}, ${height-MARGIN})`)
        .call(xaxis)

    svg.selectAll(".xAxis text") 
    .style("text-anchor", "end")
    .attr("transform", function(d) {
    return `translate(-10, 5)rotate(${angleDegrees})`
    })

    const yaxis = d3.axisLeft().scale(yscale)
    const yaxis_container = svg.append("g")
    .attr("class", "yaxis")
    .attr("transform", `translate(${MARGIN}, 0)`)
    .call(yaxis)



    let year = 1990
    //we create the same visualization than before, using the 1990 data
    const bars =  svg.selectAll(".bar")
        .data(co2perCountry)
        .join(
        enter => enter.append("rect")
        //.attr("y", yscale(0))
        .attr("class", "bar")
        .attr("fill-opacity", 0.5)
        .attr("y", (d)=>yscale(d[year+""]))
        .attr("x", (d) => xscale(d.Pays))
        .attr("width", () => xscale.bandwidth())
        .attr("height", (d)=>height-yscale(d[year+""])-MARGIN) // calculate new height relative to top
        //.attr("height", 0) 
        .attr("transform", `translate(${MARGIN}, 0)`)
        .attr("fill", "red")
        .call(enter => enter.transition(t)
                .attr("y", (d)=>yscale(d[year+""]))
                .attr("height", (d)=>height-yscale(d[year+""])-MARGIN) 
            )
        )


    let currentYearIndex = 0
    const years = [1990,2000,2013]
    
    let interval = null
    const startAnimation = ()=> {
        interval = setInterval(updateYear, 2500)
    }
    //we define a function that will update the year data using a transition. We do not actually update the data but change the height and y attributes, using a different year
    const updateYear = ()=>{
    currentYearIndex++
    let year = years[currentYearIndex]
    if (currentYearIndex<years.length) {
        bars
        .transition()
        .duration(2000)
        .attr("y", (d)=>yscale(d[year+""]))
        .attr("height", (d)=>height-yscale(d[year+""])-MARGIN)
    }
    else {
        clearInterval(interval)
    }
    
    }

    //this function will be called when pressing the play button. setInterval will call the updateYear function every 2500 ms (2.5 seconds)
    

    d3.select("#play").on("click", function () {
    startAnimation()
    })

    svg
    .append("text")
    .attr("y", 0)
    .attr("x",0)
    .text("CO2 emissions")
    .attr("transform", `translate(${MARGIN/2},${height-2*MARGIN}) rotate(-90)`)
}*/
