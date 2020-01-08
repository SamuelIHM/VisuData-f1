let drivers;
let racesPerYear;
let results;
let winPerPilot;
let racePerPilot;
let racePerYear;
let race2018;
let racesResults
let hamilton;
let raceForHamilton

//Put the drivers data into drivers

//d3.csv('formula-1-race-data/drivers.csv').then(function(data){drivers = data});

d3.csv('formula-1-race-data/drivers.csv').then(function(data) {
    //console.log(data); // [{"Hello": "world"}, …]
    //console.log(drivers)
});

//console.log(drivers)


//racesResults is the table of results
racesResults = d3.csv('formula-1-race-data/results.csv').then(function(data){return data});


//racesPerYear group the race per year, race2005 contains all the race of 2005
d3.csv('formula-1-race-data/races.csv').then(function(data){
    racesPerYear= d3.nest()
    .key(d=>{return d.year;})
    .rollup(function(v) {return v;})
    .entries(data)
})

function contains(a, obj) {
    for (var i = 0; i < a.length; i++) {
        if (a[i].raceId === obj.raceId) {
            return true;
        }
    }
    return false;
}

function getWonRacePerYear(driverRef,year){
    d3.csv('formula-1-race-data/drivers.csv').then(function(data){
        drivers = data
        driver = drivers.filter(drivers=>drivers.driverRef==driverRef)[0]
        let driverId = driver.driverId
        d3.csv('formula-1-race-data/results.csv').then(function(data){
            results=data


            raceWinForDriver=results.filter(results=>results.driverId==driverId).filter(results=>results.position=="1")

            d3.csv('formula-1-race-data/races.csv').then(function(data){
                races=data

                let raceYearDriver=races.filter(races=>races.year==year).filter(raceYear=>contains(raceWinForDriver,raceYear))
                console.log(raceYearDriver)
                return raceYearDriver.length;

            })
        });
    })
}

function getNumberRace(driverRef,year){
    d3.csv('formula-1-race-data/drivers.csv').then(function(data){
        drivers = data
        driver = drivers.filter(drivers=>drivers.driverRef==driverRef)[0]
        let driverId = driver.driverId
        d3.csv('formula-1-race-data/results.csv').then(function(data){
            results=data


            raceForDriver=results.filter(results=>results.driverId==driverId)
            d3.csv('formula-1-race-data/races.csv').then(function(data){
                races=data

                let raceYearDriver=races.filter(races=>races.year==year).filter(raceYear=>contains(raceForDriver,raceYear))
                console.log(raceYearDriver)
                return raceYearDriver.length;
            })
        });
    })
}

function getPercentage(driverRef, year){
    d3.csv('formula-1-race-data/drivers.csv').then(function(data){
        drivers = data
        driver = drivers.filter(drivers=>drivers.driverRef==driverRef)[0]
        let driverId = driver.driverId
        d3.csv('formula-1-race-data/results.csv').then(function(data){
            results=data


            raceForDriver=results.filter(results=>results.driverId==driverId)
            raceWinForDriver=results.filter(results=>results.driverId==driverId).filter(results=>results.position=="1")
            d3.csv('formula-1-race-data/races.csv').then(function(data){
                races=data

                let raceYearDriver=races.filter(races=>races.year==year).filter(raceYear=>contains(raceForDriver,raceYear))
                let raceWonYearDriver=races.filter(races=>races.year==year).filter(raceYear=>contains(raceWinForDriver,raceYear))
                console.log(year+":")
                console.log(raceWonYearDriver.length*100/raceYearDriver.length)
                return raceYearDriver.length;
            })
        });
    })
}

//getWonRacePerYear("michael_schumacher","2003")
//getNumberRace("michael_schumacher","2003")
let years = ["1991","1992","1993","1994","1995","1996","1997","1998","1999","2000","2001","2002","2003","2004","2005","2006","2007","2008","2009","2010","2011","2012"]

for (var i=0; i<years.length;i++){
    getPercentage("michael_schumacher",years[i]);
}

//getPercentage("michael_schumacher","2003")

