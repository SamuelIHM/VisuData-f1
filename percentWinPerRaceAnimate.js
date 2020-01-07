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

/*
function getHamilton (){
    while (drivers==undefined){
        console.log("")
    }
    return drivers
}*/

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


            raceForDriver=results.filter(results=>results.driverId==driverId).filter(results=>results.position=="1")

            d3.csv('formula-1-race-data/races.csv').then(function(data){
                races=data

                let raceYearDriver=races.filter(races=>races.year==year).filter(raceYear=>contains(raceForDriver,raceYear))
                console.log(raceYearDriver)
            })
        });
    })
}


function getHamiltonRace(){
    d3.csv('formula-1-race-data/drivers.csv').then(function(data){
        drivers = data
        hamilton = drivers.filter(drivers=>drivers.driverRef=="hamilton")[0]
        let hamiltonId = hamilton.driverId
        d3.csv('formula-1-race-data/results.csv').then(function(data){
            results=data


            raceForHamilton=results.filter(results=>results.driverId==hamiltonId).filter(results=>results.position=="1")

            d3.csv('formula-1-race-data/races.csv').then(function(data){
                races=data

                //console.log(raceForHamilton);
                let race2015HamiltonWin=races.filter(races=>races.year=="2015").filter(race2015=>contains(raceForHamilton,race2015))
                console.log(race2015HamiltonWin)
            })

        });
    })
}

function getRace(){
    d3.csv('formula-1-race-data/results.csv').then(function(data){
        results=data
        raceForHamilton=results.filter(results=>results.driverId=="1")
        console.log(raceForHamilton)
    });

}



function getHamilton(){
    d3.csv('formula-1-race-data/drivers.csv').then(function(data){
        drivers = data
        hamilton = drivers.filter(drivers=>drivers.driverRef=="hamilton")[0]
        console.log(hamilton.code)
    })
}

function getRace2015(){
    d3.csv('formula-1-race-data/races.csv').then(function(data){
        races=data
        race2015=races.filter(races=>races.year=="2015")
        console.log(race2015)

    })
}
//let hamilton = drivers.filter(drivers=>drivers.surname=="hamilton")

//getHamilton()

//getRace()

//getRace2018()

//getHamiltonRace()
//getWonRacePerYear("hamilton","2015")
getWonRacePerYear("michael_schumacher","2003")
//let hamiltonVictory2005 = racesResults.filter(racesResults=>racesResults.position==1).filter(racesResults.driverId==hamilton.driverId)


//console.log(getHamilton())
//console.log(getHamilton())
//console.log(hamiltonVictory2005)



