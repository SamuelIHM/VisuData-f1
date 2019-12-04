let drivers;
let racesPerYear;
let results;
let winPerPilot;
let racePerPilot;
let racePerYear;
let race2005;
let racesResults

//Put the drivers data into drivers
d3.csv('formula-1-race-data/drivers.csv').then(function(data){drivers = data});


//racesPerYear group the race per year, race2005 contains all the race of 2005
d3.csv('formula-1-race-data/races.csv').then(function(data){
    racesPerYear= d3.nest()
    .key(d=>{return d.year;})
    .rollup(function(v) {return v;})
    .entries(data)
    race2005 = racesPerYear.filter(racesPerYear=>racesPerYear.key=="2005")
    console.log(race2005)
})


d3.csv('formula-1-race-data/results.csv').then(function(data){
    racesResults = data
    racesResults.forEach((row)=>{
        let result = racesResults.filter(function(raceResult){
            return raceResult.id == row.id
        })
        row.winner = result.filter(function(raceResult){
            return raceResult.position=="1"
        })
    })
});