let width = 2000
let height = 2000
const svg = d3.select("body").append("svg").attr("width", width).attr("height", height);


let drivers;
let constructors;
let results;
let winPerTeamPilot;
let winPerTeamDriver = [];
let driverWhoWon;

let MIN_WIN = 10;

margin = ({top: 10, right: 10, bottom: 20, left: 40})




xAxis = g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).tickSizeOuter(0))
    .call(g => g.selectAll(".domain").remove())

yAxis = g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).ticks(null, "s"))
    .call(g => g.selectAll(".domain").remove())



d3.csv('formula-1-race-data/drivers.csv').then(function(data){drivers = data});
d3.csv('formula-1-race-data/constructors.csv').then(function(data){constructors = data});
d3.csv('formula-1-race-data/results.csv').then(function(data){
    results = data
    let filteredResults = results.filter(d=>{return d.position == 1;})

    // on classe par équipe puis le nombre de victoire par pilote
    winPerTeamPilot = d3.nest()
        .key(d=>d.constructorId)
        .key(d=>d.driverId)
        .rollup(function(v) {return v.length;})
        .entries(filteredResults);

    // une liste avec les pilotes ayant gagné une fois
    driverWhoWon = d3.nest()
        .key(d=>d.driverId)
        .rollup(function(v) {return v.length;})
        .entries(filteredResults);

    // on rajoute les nom des pilotes
    driverWhoWon.forEach((row)=> {
        let result = drivers.filter(function(driver) {
            return row.key == driver.driverId;
        })
        row.driverName = result[0].driverRef;
    })

    // on ajoute le nom des pilotes à la liste qu'on va utiliser
    winPerTeamPilot.forEach((row)=>{
        row.values.forEach((row1) => {
            let result = drivers.filter(function(driver){
                return driver.driverId == row1.key;
            })
            row1.driverName = result[0].driverRef;
        })
    })

    // on ajoute aux constructeur des clé qui ont pour nom le pilote et la valeur le nb de victoires
    constructors.forEach((row)=>{
        let result = winPerTeamPilot.filter(function(team){
            return team.key == row.constructorId;
        })
        if (result.length != 0) {
            result[0].values.forEach((driver) => {
                var driverName = driver.driverName.toString()
                row[driverName] = driver.value;
            })
        }
    })

    // on ajoute les pilotes ayant gagné quelque chose dans chaque écurie en mettant 0 comme
    // nombre de victoire
    driverWhoWon.forEach((row) => {
        constructors.forEach((row1) =>{
            if (! d3.map(row1).has(row.driverName)){
                var driverName = row.driverName.toString()
                row1[driverName] = 0;
            }
        })
    })

    // on ajoute le nombre total de victoire
    var keys = d3.keys(constructors[0]).slice(6)
    constructors.forEach((row) => {
        var sum = 0;
        keys.forEach((key)=> {
            sum += row[key]
        })
        row.total = sum;
    })

    // on va afficher les équipes ayant gagné + de X victoires
    let constructorWorth = constructors.filter(function(team) {
        return team.total >= MIN_WIN;
    })

    // on trie les écuries
    constructorWorth.sort(function(x, y){
        return d3.descending(x.total, y.total);
    })


    var nbConstructorWorth = d3.map(constructorWorth[0]).size()

    series = d3.stack().keys(d3.keys(constructorWorth[0]).slice(6, nbConstructorWorth-1))(constructorWorth)


    var colors = d3.map([]);
    var dddd = d3.keys(constructorWorth[0]).slice(6, nbConstructorWorth-1)
    var nbDriver = d3.keys(constructorWorth[0]).slice(6, nbConstructorWorth-1).length;
    dddd.forEach((row, index) =>{
        colors.set(row, d3.interpolateSinebow(index / nbDriver))
    })



    x = d3.scaleBand()
        .domain(constructorWorth.map(d => d.name))
        .range([margin.left, width - margin.right])
        .padding(0.1)

    y = d3.scaleLinear()
        .domain([0, d3.max(series, d => d3.max(d, d => d[1]))])
        .rangeRound([height - margin.bottom, margin.top])

    // on construit le graphe
    svg.append("g")
        .selectAll("g")
        .data(series)
        .join("g")
        .attr("fill", d => colors.get(d.key))
        .selectAll("rect")
        .data(d => d)
        .join("rect")
        .attr("x", (d, i) => x(d.data.name))
        .attr("y", d => y(d[1]))
        .attr("height", d => y(d[0]) - y(d[1]))
        .attr("width", x.bandwidth());

    svg.append("g")
        .call(xAxis);

    svg.append("g")
        .call(yAxis);

});