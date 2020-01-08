let width = 1000
let height = 1000
const svg = d3.select("body").append("svg").attr("width", width).attr("height", height);
let g;


let SchYears = ["1991","1992","1993","1994","1995","1996","1997","1998","1999","2000","2001","2002","2003","2004","2005","2006","2010","2011","2012"]
let HamYears =["2007","2008","2009","2010","2011","2012","2013","2014","2015","2016","2017","2018"]
let years = ["1991","1992","1993","1994","1995","1996","1997","1998","1999","2000","2001","2002","2003","2004","2005","2006","2007","2008","2009","2010","2011","2012","2013","2014","2015","2016","2017","2018"]

let sch = [["1991",0]];
let schAge = [[22,0]];
let ham = [];
let hamAge=[];

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







async function fill(selectedYear){




        var x = await d3.csv('formula-1-race-data/results.csv').then(function(data) {
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



            for (var i=0;i<winPerPilot.length;i++){
                if (winPerPilot[i].driverRef=="hamilton"){
                    ham.push([selectedYear, winPerPilot[i].win]);
                    hamAge.push([selectedYear-1985,winPerPilot[i].win])

                }
                if (winPerPilot[i].driverRef=="michael_schumacher"){
                    sch.push([selectedYear,winPerPilot[i].win]);
                    schAge.push([selectedYear-1969,winPerPilot[i].win])
                }
            }


            return new Promise(resolve => {

                    resolve(selectedYear)
            });


    })

        return new Promise(resolve => {
            resolve(selectedYear);
    });
};



async function fillAll(){
    for (var j=0;j<years.length;j++){
        await fill(years[j]);

    }
    ham.sort(function (x, y) {
        return d3.ascending(x[0], y[0]);
    })
    sch.sort(function (x, y) {
        return d3.ascending(x[0], y[0]);
    })

    return new Promise(resolve => {
        resolve("fillAll");
    });

}

async function getSort(){
    var wait = await fillAll() ;



    const width = 800
    const height = 400
    const MARGIN = 80
    let maxTextLength = 100
    const angleDegrees = -45
    const angleRadians = angleDegrees * (Math.PI / 180)
    const padding = 100



    let winHam = 0;
    let winSch=0;
    let winSumHam = [];
    let winSumSch = [];

    for (var i = 0;i<ham.length;i++){
        winHam+=ham[i][1];
        winSumHam.push(winHam);
    }

    for (var i = 0;i<sch.length;i++){
        winSch+=sch[i][1];
        winSumSch.push(winSch);
    }


    console.log(winSumHam)
    console.log(winSumSch)
    /*
    console.log("ham");
    console.log(ham);
    console.log(hamAge);
    console.log("sch");
    console.log(sch);
    console.log(schAge)
    */

    svg.append("rect")
        .attr("width",2000)
        .attr("height",2000)
        .attr("fill","black")



    svg.append("text")
        .attr('x',30)
        .attr('y',30)
        .attr('font-size',40)
        .attr("fill","white")
        .text("Schumacher vs Hamilton per season")

    for (var i=0;i<12;i++){



        svg.append("text")
            .attr('y',520)
            .attr('x',80*i+5)
            .attr("fill","white")
            .text("Saison "+(i+1).toString())

            svg.append('rect')
                .attr('y',500-5*winSumSch[i])
                .attr('x',80*i)
                .attr('height',5*winSumSch[i])
                .attr('width',30)
                .attr('fill','red')

            svg.append('text')
                .attr('y',500-5*winSumSch[i]-5)
                .attr('x',80*i+7)
                .attr("fill","white")
                .text(winSumSch[i])

            svg.append('rect')
                .attr('y',500-5*winSumHam[i])
                .attr('x',80*i+30)
                .attr('height',5*winSumHam[i])
                .attr('width',30)
                .attr('fill','grey')

            svg.append('text')
                .attr('y',500-5*winSumHam[i]-5)
                .attr('x',80*i+30+7)
                .attr("fill","white")
                .text(winSumHam[i])







    }





}

getSort();



//https://stackoverflow.com/questions/18197138/how-to-wait-on-d3-json-to-finish
