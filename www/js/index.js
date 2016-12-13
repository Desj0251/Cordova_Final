"use strict"; // Needed for mobile browsers

/**
*   Installed on the class Samsung Nexus 6 - 1
**/

if (document.deviceready) {
    document.addEventlistener('deviceready', onDeviceReady);
} else {
    document.addEventListener('DOMContentLoaded', onDeviceReady)
}

var my_score_data = [];

/**
*   Main Init Function
**/
function onDeviceReady() {
    // console.log("Ready!");
    serverData.getJSON();
    
    document.getElementById("btnSched").setAttribute("disabled","disabled");
    
    document.getElementById("btnSched").addEventListener("click", function(){
        let page1 = document.querySelector(".page1").classList.toggle("active");
        let page2 = document.querySelector(".page2").classList.toggle("active");
        document.getElementById("btnStand").removeAttribute("disabled","disabled");
        document.getElementById("btnSched").setAttribute("disabled","disabled");
    });
    document.getElementById("btnStand").addEventListener("click", function(){
        let page1 = document.querySelector(".page1").classList.toggle("active");
        let page2 = document.querySelector(".page2").classList.toggle("active");
        document.getElementById("btnSched").removeAttribute("disabled","disabled");
        document.getElementById("btnStand").setAttribute("disabled","disabled");
    }); 
    document.getElementById("btnRefresh").addEventListener("click", function(){
        document.querySelector(".schedule").innerHTML = "";
        document.querySelector(".standings").innerHTML = "";
        serverData.getJSON();
    }); 
}

let serverData = {
    url: "https://griffis.edumedia.ca/mad9014/sports/hockey.php",
    httpRequest: "GET",
    getJSON: function () {
        
        // Add headers and options objects
        // Create an empty Request Headers instance
        let headers = new Headers();

        // Add a header(s)
        // key value pairs sent to the server

        headers.append("Content-Type", "text/plain");
        headers.append("Accept", "application/json; charset=utf-8");
        
        // simply show them in the console
        console.dir("headers: " + headers.get("Content-Type"));
        console.dir("headers: " + headers.get("Accept"));
        
        // Now the best way to get this data all together is to use an options object:
        
        // Create an options object
        let options = {
            method: serverData.httpRequest,
            mode: "cors",
            headers: headers
        };
        
        // Create an request object so everything we need is in one package
        let request = new Request(serverData.url, options);
        console.log(request);
           
        fetch(request)
            .then(function (response) {

                console.log(response);
                return response.json();
            })
            .then(function (data) {
                // console.log(data); // now we have JS data, let's display it
            
                localStorage.setItem("scores", JSON.stringify(data));
                // my_score_data = JSON.parse(localStorage.getItem("scores"));

                // Call a function that uses the data we recieved  
                displayData(data);
            })
            .catch(function (err) {
                alert("Error: " + err.message);
            });
    }
};

function displayData(data) {
    
    console.log(data);
    
    // Declare Variables containing Data to be used
    let scores = data.scores;
    let teams = data.teams;
    
    let team_list = [];
    
    // Create an Array with Objects for each team generated
    teams.forEach(function (value) {
        var team = {
            teamID:     value.id,
            teamName:   TeamNames(data.teams, value.id),
            win:        0,
            loss:       0,
            tie:        0,
            pts:        0,
            games:      0,
            gf:         0,
            ga:         0
        };
        team_list.push(team); // Push object into the end of the array
    })
    
    console.log(team_list);
    
    // Display of Schedule and Scores
    console.log("\n\nScores Page\n\n");
    
    var table = document.createElement("TABLE");
    table.className += "table_schedule";
    document.querySelector(".schedule").appendChild(table);
    
    scores.forEach(function (value) {
        
        console.log(value.date);
        let games = value.games;
        
        let tr = document.createElement("tr");
        let date = document.createElement("td");
        
        date.innerHTML = value.date;
        tr.appendChild(date);
        date.setAttribute("colspan", 3);
        date.className += "black";
        document.querySelector(".table_schedule").appendChild(tr);
        
        let display = document.createElement("tr");
        display.className += "grey";
        let home = document.createElement("td");
        let score = document.createElement("td");
        let away = document.createElement("td");
        
        away.innerHTML = "Away Team";
        score.innerHTML = "Score";
        home.innerHTML = "Home Team";
        display.appendChild(away);
        display.appendChild(score);
        display.appendChild(home);
        document.querySelector(".table_schedule").appendChild(display);
        
        games.forEach(function (value_games) {
            
            // Sets variables for home/away teams and scores
            let homeScore = value_games.home_score;
            let awayScore = value_games.away_score;
            
            let homeTeam = TeamNames(data.teams, value_games.home);
            let awayTeam = TeamNames(data.teams, value_games.away);
            
            // Check if Home Team Wins and give appropriate win/loss/pts
            if (homeScore > awayScore) {
                for (var i = 0; i < team_list.length; i++){ if ( value_games.home == team_list[i].teamID ) { team_list[i].win++; team_list[i].pts = team_list[i].pts + 2; team_list[i].games++; team_list[i].gf += homeScore; team_list[i].ga += awayScore; } }
                for (var i = 0; i < team_list.length; i++){ if ( value_games.away == team_list[i].teamID ) { team_list[i].loss++; team_list[i].pts = team_list[i].pts + 0; team_list[i].games++; team_list[i].gf += awayScore; team_list[i].ga += homeScore; } }            
            }
            // Check if Home Team Loses and give Appropriate win/loss/pts
            if (homeScore < awayScore) {
                for (var i = 0; i < team_list.length; i++){ if ( value_games.home == team_list[i].teamID ) { team_list[i].loss++; team_list[i].pts = team_list[i].pts + 0; team_list[i].games++; team_list[i].gf += homeScore; team_list[i].ga += awayScore; } }
                for (var i = 0; i < team_list.length; i++){ if ( value_games.away == team_list[i].teamID ) { team_list[i].win++; team_list[i].pts = team_list[i].pts + 2; team_list[i].games++; team_list[i].gf += awayScore; team_list[i].ga += homeScore; } }            
            }
            // Check if TIE and give appropriate ties/pts
            if (homeScore == awayScore) {
                for (var i = 0; i < team_list.length; i++){ if ( value_games.home == team_list[i].teamID ) { team_list[i].tie++; team_list[i].pts = team_list[i].pts + 1; team_list[i].games++; team_list[i].gf += homeScore; team_list[i].ga += awayScore; } }
                for (var i = 0; i < team_list.length; i++){ if ( value_games.away == team_list[i].teamID ) { team_list[i].tie++; team_list[i].pts = team_list[i].pts + 1; team_list[i].games++; team_list[i].gf += awayScore; team_list[i].ga += homeScore; } }            
            }
            
            console.log(awayTeam + " " + awayScore + " - " + homeScore + " " + homeTeam);
            let trbody = document.createElement("tr");
            let away_display = document.createElement("td");
            let home_display = document.createElement("td");
            let score_display = document.createElement("td");
            
            away_display.innerHTML = TeamLogos(awayTeam) + awayTeam;
            score_display.innerHTML = awayScore + " - " + homeScore;
            home_display.innerHTML = homeTeam + TeamLogos(homeTeam);
            
            trbody.appendChild(away_display);
            trbody.appendChild(score_display);
            trbody.appendChild(home_display);
            
            document.querySelector(".table_schedule").appendChild(trbody);
            
        })
        
        
        
    })
    
    // Display of League Standings
    console.log("\n\nStandings Page\n\n");
    
    team_list.sort(dynamicSort("pts"));
    // console.log(team_list);
    
    var table_2 = document.createElement("TABLE");
        table_2.className += "table_standings";
        document.querySelector(".standings").appendChild(table_2);
    
    let tr = document.createElement("tr");
    let standing = document.createElement("td");
        standing.innerHTML = "<img src=\"img/pngteamicons/nhl.png\"> League Standings";
        standing.className += "black";
        tr.appendChild(standing);
        standing.setAttribute("colspan", 10);
    document.querySelector(".table_standings").appendChild(tr);
    
    let display = document.createElement("tr");
        display.className += "grey";
        let RK = document.createElement("td");
            RK.innerHTML = "RK";
            display.appendChild(RK);
        let TEAMNM = document.createElement("td");
            TEAMNM.innerHTML = "TEAM";
            display.appendChild(TEAMNM);
        let GP = document.createElement("td");
            GP.innerHTML = "GP";
            display.appendChild(GP);
        let WIN = document.createElement("td");
            WIN.innerHTML = "W";
            display.appendChild(WIN);
        let LOSS = document.createElement("td");
            LOSS.innerHTML = "L";
            display.appendChild(LOSS);
        let TIE = document.createElement("td");
            TIE.innerHTML = "T";
            display.appendChild(TIE);
        let PTS = document.createElement("td");
            PTS.innerHTML = "PTS";
            display.appendChild(PTS);
        let GF = document.createElement("td");
            GF.innerHTML = "GF";
            display.appendChild(GF);
        let GA = document.createElement("td");
            GA.innerHTML = "GA";
            display.appendChild(GA);
        let DIFF = document.createElement("td");
            DIFF.innerHTML = "DIFF";
            display.appendChild(DIFF);
    document.querySelector(".table_standings").appendChild(display);
    
    var rank = 1;
    team_list.forEach(function (value) {
        
        var diff = value.gf - value.ga;
        
        console.log( " Rank: " + rank + " Team: " + value.teamName + " Games: " + value.games + " wins: " + value.win + " Losses: " + value.loss + " Ties: " + value.tie + " pts: " + value.pts + " GF: " + value.gf + " GA: " + value.ga + " DIFF: " + diff);
        
        let display = document.createElement("tr");
        let RK = document.createElement("td");
            RK.innerHTML = rank;
            display.appendChild(RK);
        let TEAMNM = document.createElement("td");
            TEAMNM.innerHTML = TeamLogos(value.teamName) + value.teamName;
            display.appendChild(TEAMNM);
        let GP = document.createElement("td");
            GP.innerHTML = value.games;
            display.appendChild(GP);
        let WIN = document.createElement("td");
            WIN.innerHTML = value.win;
            display.appendChild(WIN);
        let LOSS = document.createElement("td");
            LOSS.innerHTML = value.loss;
            display.appendChild(LOSS);
        let TIE = document.createElement("td");
            TIE.innerHTML = value.tie;
            display.appendChild(TIE);
        let PTS = document.createElement("td");
            PTS.innerHTML = value.pts;
            display.appendChild(PTS);
        let GF = document.createElement("td");
            GF.innerHTML = value.gf;
            display.appendChild(GF);
        let GA = document.createElement("td");
            GA.innerHTML = value.ga;
            display.appendChild(GA);
        let DIFF = document.createElement("td");
            DIFF.innerHTML = diff;
            display.appendChild(DIFF);
        document.querySelector(".table_standings").appendChild(display);
            
        rank++;
    })
    
}

function TeamNames(teams, id) {
    for (let i = 0; i < teams.length; i++) {
        if (teams[i].id == id) {
            return teams[i].name;
        }
    }
    return "TeamNameNotFound";
}

function dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (b,a) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

function TeamLogos(teams){
    switch(teams) {
                case "Ottawa Senators":
                    return "<img src=\"img/pngteamicons/ottawa.png\">";
                    break;
                case "Montreal Canadiens":
                    return "<img src=\"img/pngteamicons/montreal.png\">";
                    break;
                case "New York Rangers":
                    return "<img src=\"img/pngteamicons/newyork.png\">";
                    break;
                case "Florida Panthers":
                    return "<img src=\"img/pngteamicons/florida.png\">";
                    break;
                case "Toronto Maple Leafs":
                    return "<img src=\"img/pngteamicons/toronto.png\">";
                    break;
                case "New York Islanders":
                    return "<img src=\"img/pngteamicons/longisland.png\">";
                    break;
                case "Carolina Hurricanes":
                    return "<img src=\"img/pngteamicons/carolina.png\">";
                    break;
                case "Buffalo Sabers":
                    return "<img src=\"img/pngteamicons/buffalo.png\">";
                    break;
                case "Pittsburgh Penguins":
                    return "<img src=\"img/pngteamicons/pittsburgh.png\">";
                    break;
                case "Tampa Bay Lightning":
                    return "<img src=\"img/pngteamicons/tampabay.png\">";
                    break;
                case "Boston Bruins":
                    return "<img src=\"img/pngteamicons/boston.png\">";
                    break;
                case "Detroit Red Wings":
                    return "<img src=\"img/pngteamicons/detroit.png\">";
                    break;
                case "Columbus Blue Jackets":
                    return "<img src=\"img/pngteamicons/columbus.png\">";
                    break;
                case "Philadelphia Flyers":
                    return "<img src=\"img/pngteamicons/philadelphia.png\">";
                    break;
                case "New Jersey Devils":
                    return "<img src=\"img/pngteamicons/newjersey.png\">";
                    break;
                case "Washington Capitals":
                    return "<img src=\"img/pngteamicons/washington.png\">";
                    break;
                default:
                    return "TeamNotFound";
            }
}