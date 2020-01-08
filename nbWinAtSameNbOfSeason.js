let width = 1000
let height = 200
const svg = d3.select("body").append("svg").attr("width", width).attr("height", height);


let SchYears = ["1991","1992","1993","1994","1995","1996","1997","1998","1999","2000","2001","2002","2003","2004","2005","2006","2010","2011","2012"]
let HamYears =["2007","2008","2009","2010","2011","2012","2013","2014","2015","2016","2017","2018"]
let years = ["1991","1992","1993","1994","1995","1996","1997","1998","1999","2000","2001","2002","2003","2004","2005","2006","2007","2008","2009","2010","2011","2012","2013","2014","2015","2016","2017","2018"]

let sch = [];
let ham = []

let drivers;
let races;
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


d3.csv('formula-1-race-data/drivers.csv').then(function(data){drivers = data.filter(
    results=>results.driverRef=="hamilton"||results.driverRef=="michael_schumacher")
});
d3.csv('formula-1-race-data/races.csv').then(function(data){races=data});


function fill(selectedYear){
d3.csv('formula-1-race-data/results.csv').then(function(data) {
    let numberOfRace = d3.nest()
        .key(d => {
            return d.year;
        })
        .rollup(function (v) {
            return v.length;
        })
        .entries(races)
        .filter(d => {
            return d.key == selectedYear
        })


    results = data;
    let wins = results.filter(d => {
        return d.position == 1;
    })

    wins.forEach((row) => {
        let result = races.filter(function (race) {
            return race.raceId == row.raceId;
        })
        row.year = result[0].year
    })
    wins = d3.nest()
        .key(d => {
            return d.year;
        })
        .entries(wins)


    let win = wins.filter(d => {
        return d.key == selectedYear
    })[0]


    if (win!=undefined){
        winPerPilot = d3.nest()
            .key(d => {
                return d.driverId;
            })
            .rollup(function (v) {
                return v.length;
            })
            .entries(win.values)
    }


    /*
        let numberOfRace = d3.nest()
            .key(d=>{return d.driverId;})
            .rollup(function(v) {return v.length;})
            .entries(results)

     */


    winPerPilot = winPerPilot.filter(win => {
        let flag = false;
        for (var i = 0; i < drivers.length; i++) {
            if (drivers[i].driverId == win.key) {
                flag = true;
            }
        }
        return flag;
    })


    winPerPilot.forEach((row) => {
        let result = drivers.filter(function (driver) {
            return driver.driverId == row.key;
        })

        row.driverRef = result[0].driverRef
        row.nationality = result[0].nationality
    })

    winPerPilot.forEach((row) => {

        row.win=row.value;
        row.percentWin = Math.round((100 * row.value / numberOfRace[0].value) * 100) / 100;
        row.value = numberOfRace[0].value;
    })

/*
    winPerPilot.sort(function (x, y) {
        return d3.descending(x.percentWin, y.percentWin);
    })
    */

    for (var i=0;i<winPerPilot.length;i++){
        if (winPerPilot[i].driverRef=="hamilton"){
            ham.push([selectedYear, winPerPilot[i].value]);
        }
        if (winPerPilot[i].driverRef=="michael_schumacher"){
            sch.push([selectedYear,winPerPilot[i].win]);
        }
    }
})};

/*
    console.log(winPerPilot)

    let x = d3.scaleLinear()
        .domain([0, d3.max(winPerPilot, d => 100)])
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
        .attr("width", d => x(d.percentWin) - x(0))
        .attr("height", y.bandwidth());

    svg.append("g")
        .attr("fill", "white")
        .attr("text-anchor", "middle")
        .style("font", "12px sans-serif")
        .selectAll("text")
        .data(winPerPilot)
        .join("text")
        .attr("x", d => x(d.percentWin) / 2 + 15)
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
        .attr("x", d => x(d.percentWin) + 5)
        .attr("y", d => y(d.driverRef) + y.bandwidth() / 2)
        .attr("dy", "0.35em")
        .text(d => d.percentWin);

});
*/

function fillAll(){
    for (var j=0;j<years.length;j++){
        fill(years[j]);
    }
    ham.sort(function (x, y) {
        return d3.descending(x[0], y[0]);
    })
    sch.sort(function (x, y) {
        return d3.descending(x[0], y[0]);
    })

}

function sort(){
    fillAll();
    ham.sort(function (x, y) {
        return d3.descending(x[0], y[0]);
    })
    sch.sort(function (x, y) {
        return d3.descending(x[0], y[0]);
    })
    console.log("ham");
    console.log(ham);
    console.log("sch");
    console.log(sch);
}

sort();




