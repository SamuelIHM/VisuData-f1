let width = 1000
let height = 2000
const svg = d3.select("body").append("svg").attr("width", width).attr("height", height);


let drivers;
let constuctors;
let results;
let winPerTeamPilot;
var winPerTeamDriver = [];

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
d3.csv('formula-1-race-data/results.csv').then(function(data){
    results = data
    let filteredResults = results.filter(d=>{return d.position == 1;})

    winPerTeamPilot = d3.nest()
        .key(d=>d.constructorId)
        .key(d=>d.driverId)
        .rollup(function(v) {return v.length;})
        .entries(filteredResults);

    winPerTeamPilot.forEach((row)=>{
        let result = constuctors.filter(function(constructor){
            return constructor.constructorId == row.key;
        })
        row.constructorName = result[0].name;
    })

    winPerTeamPilot.forEach((row)=>{
        row.values.forEach((row1) => {
            let result = drivers.filter(function(driver){
                return driver.driverId == row1.key;
            })
            row1.driverName = result[0].driverRef;
        })
    })


    winPerTeamPilot.forEach((row)=>{
        row.values.forEach((row1 =>{
            winPerTeamDriver.push(row1)
            row1.constructorName = row.constructorName;
        }))
    })

    console.log(winPerTeamDriver)

    /*picasso.chart({
        element: document.querySelector('.svg'),
        winPerTeamPilot,
        settings: {
            collections: [{
                key: 'stacked',
                data: {
                    extract: {
                        field: 'constructorName',
                        props: {
                            series: { field: 'Driver' },
                            end: { field: 'wins' }
                        }
                    },
                    stack: {
                        stackKey: d => d.key,
                        value: d => d.value
                    }
                }
            }],
            scales: {
                y: {
                    data: {
                        collection: {
                            key: 'stacked'
                        }
                    },
                    invert: true,
                    expand: 0.2,
                    min: 0
                },
                t: { data: { extract: { field: 'constructorName' } }, padding: 0.3 },
                color: { data: { extract: { field: 'Driver' } }, type: 'color' }
            },
            components: [{
                type: 'axis',
                dock: 'left',
                scale: 'y'
            },{
                type: 'axis',
                dock: 'bottom',
                scale: 't'
            }, {
                type: 'legend-cat',
                scale: 'color',
                dock: 'top'
            },{
                key: 'bars',
                type: 'box',
                data: {
                    collection: 'stacked'
                },
                settings: {
                    major: { scale: 't' },
                    minor: { scale: 'y', ref: 'end' },
                    box: {
                        fill: { scale: 'color', ref: 'series' }
                    }
                }
            }]
        }
    })*/

});