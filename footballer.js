document.addEventListener('DOMContentLoaded', (event) => {
    populateTeamsTable();

    //add listeners to radio inputs
    let all = document.getElementById('all');
    let wins = document.getElementById('winsOnly')
    let losses = document.getElementById('lossesOnly')
    let ties = document.getElementById('tiesOnly');

    all.addEventListener('change', createGamesTable)
    wins.addEventListener('change', createGamesTable)
    losses.addEventListener('change', createGamesTable)
    ties.addEventListener('change', createGamesTable)

    //add listener to search input
    let search = document.getElementById('searchField');
    search.addEventListener('change', createGamesTable);
    search.addEventListener('keypress', checkName, false);

});


let revert = function(event){
    //hide the games table and remove the title of the team
    let gamesContainer = document.getElementById('games-container')
    gamesContainer.setAttribute('style', 'display:none');

    let h2 = document.getElementById('details');
    h2.firstChild.remove();

    //show the teams table
    let teamsTable = document.getElementById('teams-container');
    teamsTable.setAttribute('style', 'display:');

    //destory data in original table
    let gamesTable = document.getElementById('games');
    gamesTable.firstChild.remove();
    gamesTable.firstChild.remove();

    //search field
    let search = document.getElementById('searchField');
    search.value = '';
}

let sortGamesByDate = function(games){
    return games.sort((a,b) => b.date - a.date);
};

let sortTeams = function(teams){
    return teams.sort(
        function(a,b) {
            if((b.stats.wins *2 + b.stats.ties) == (a.stats.wins*2 + a.stats.ties)){
                if(b.stats.wins != a.stats.wins){
                    return b.stats.wins - a.stats.wins;
                }
                else{
                    if(a.name < b.name) { return -1; }
                    if(a.name > b.name) { return 1; }
                    return 0;

                }
            }
            else{
                return (b.stats.wins *2 + b.stats.ties) - (a.stats.wins*2 + a.stats.ties);
            }
        })
};

function checkName(evt) {
    var charCode = evt.charCode;
    if (charCode != 0) {
      if (charCode == 13) {
        evt.preventDefault();
      }
    }
  }

let calcGameResult = function(team, game){
    //team is home
    if(team == game.home){
        if(game.homeScore > game.awayScore){
            return 'W';
        }
        else if(game.homeScore < game.awayScore){
            return 'L';
        }
        else{
            return 'T';
        }
    }
    else{
        if(game.homeScore > game.awayScore){
            return 'L';
        }
        else if(game.homeScore < game.awayScore){
            return 'W';
        }
        else{
            return 'T';
        }
    }
}

let createGamesTable = function(event){
    //getting the team selected id
    let id = event.target.getAttribute('team_id');
    let node = document.getElementById('games-container');

    //makes the search bar show up
    node.setAttribute('style', 'display:');

    //make the teams_table go away
    let teams_container = document.getElementById('teams-container');
    teams_container.setAttribute('style', 'display:none');

    //geting the elements for the name of the team and the table
    let h2 = document.getElementById('details')

    h2.setAttribute('team_id', id);

    //getting team info
    baller.getTeam(id, function(string, team){
        //if title of team is already there leave it        
        if(!h2.firstChild){
            let txt = document.createTextNode(team.name);
            h2.appendChild(txt);
        }
        let gamesTable = document.getElementById('games')

        //if there is data get rid of it
        if(gamesTable.firstChild){
            gamesTable.firstChild.remove();
            gamesTable.firstChild.remove();
        }
        baller.getGames(id, function(error, games){
            if(error){
                alert(error);
            }
            else{
                //get all radio inputs
                let all = document.getElementById('all');
                let wins = document.getElementById('winsOnly')
                let losses = document.getElementById('lossesOnly')
                let ties = document.getElementById('tiesOnly');
                let search = document.getElementById('searchField');

                all.setAttribute('team_id', team.id);
                wins.setAttribute('team_id', team.id);
                losses.setAttribute('team_id', team.id);
                ties.setAttribute('team_id', team.id);
                search.setAttribute('team_id', team.id);



                //sort games by date
                games = sortGamesByDate(games);

                //serach filter
                if(event.target.id == 'searchField'){
                    let substring = event.target.value.toLowerCase();
                    let teamId = event.target.getAttribute('team_id');
                    games = games.filter(function(g){
                        if((g.home.name.toLowerCase().includes(substring) && g.home.id != teamId)
                         || (g.away.name.toLowerCase().includes(substring) && g.away.id != teamId)){
                            return true;
                        }
                    })
                }

                //filter
                if(event.target.id != 'all'){
                    if(event.target.id == 'winsOnly'){
                        games = games.filter(function(g){
                            if(calcGameResult(team, g) == 'W'){
                                return true;
                            }
                        })
                    }
                    else if(event.target.id == 'lossesOnly'){
                        games = games.filter(function(g){
                            if(calcGameResult(team, g) == 'L'){
                                return true;
                            }
                        })
                    }
                    else if(event.target.id == 'tiesOnly'){
                        games = games.filter(function(g){
                            if(calcGameResult(team, g) == 'T'){
                                return true;
                            }
                        })
                    }
                }
                //creating header row
                let gameThead = document.createElement('thead');
                let gameTr = document.createElement('tr');
    
                gameThead.appendChild(gameTr);
                gamesTable.appendChild(gameThead);
    
                //Home
                let gameTd = document.createElement('td');
                let gameTxt = document.createTextNode('Home');
    
                gameTd.appendChild(gameTxt);
                gameTr.appendChild(gameTd);
    
                //Home Score
                gameTd = document.createElement('td');
                gameTxt = document.createTextNode('Score');
    
                gameTd.appendChild(gameTxt);
                gameTr.appendChild(gameTd);
    
                //Away
                gameTd = document.createElement('td');
                gameTxt = document.createTextNode('Away');

    
                gameTd.appendChild(gameTxt);
                gameTr.appendChild(gameTd);
    
                //Away score
                gameTd = document.createElement('td');
                gameTxt = document.createTextNode('Score');
    
                gameTd.appendChild(gameTxt);
                gameTr.appendChild(gameTd);
    
                //Date
                gameTd = document.createElement('td');
                gameTxt = document.createTextNode('Date');
    
                gameTd.appendChild(gameTxt);
                gameTr.appendChild(gameTd);
    
                //Result
                gameTd = document.createElement('td');
                gameTxt = document.createTextNode('Result');
    
                gameTd.appendChild(gameTxt);
                gameTr.appendChild(gameTd);
    
                //creating the tbody for the games
                let gameTBody = document.createElement('tbody');
                gamesTable.appendChild(gameTBody)
    
                //fill in the body with the games
                
                for(let j = 0; j < games.length; j++){
                    gameTr = document.createElement('tr');
    
                    //Home data
                    gameTd = document.createElement('td');
                    gameTxt = document.createTextNode(games[j].home.name);
                    gameTd.setAttribute('class','team-name-data')
    
                    gameTd.appendChild(gameTxt);
                    gameTr.appendChild(gameTd);
    
                    //Home score data
                    gameTd = document.createElement('td');
                    gameTd.setAttribute('class', 'score');
                    gameTxt = document.createTextNode(games[j].homeScore);
    
                    gameTd.appendChild(gameTxt);
                    gameTr.appendChild(gameTd);
    
                    //Away name
                    gameTd = document.createElement('td');
                    gameTxt = document.createTextNode(games[j].away.name);
                    gameTd.setAttribute('class','team-name-data')
    
                    gameTd.appendChild(gameTxt);
                    gameTr.appendChild(gameTd);
    
                    //Away score data
                    gameTd = document.createElement('td');
                    gameTd.setAttribute('class', 'score');
                    gameTxt = document.createTextNode(games[j].awayScore);
    
                    gameTd.appendChild(gameTxt);
                    gameTr.appendChild(gameTd);
    
                    //Date data
                    //parsing date in to seperate parts
                    let month = games[j].date.getUTCMonth() +1;
                    let day = games[j].date.getUTCDate();
                    let year = games[j].date.getUTCFullYear();
    
                    gameTd = document.createElement('td');
                    gameTd.setAttribute('class', 'date');
                    gameTxt = document.createTextNode(`${month}/${day}/${year}`);
    
                    gameTd.appendChild(gameTxt);
                    gameTr.appendChild(gameTd)
    
    
    
                    //result data
                    let result = calcGameResult(team, games[j]);
                    console.log(result);
                    let divR = document.createElement('div');
                    // divR.setAttribute('class', 'btn');
                    gameTd = document.createElement('td');
                    gameTd.setAttribute('class', 'result');
                    if(result == 'W'){
                        gameTd.setAttribute('result', 'win');
                    }
                    else if(result == 'L'){
                        gameTd.setAttribute('result', 'loss');
                    }
                    else{
                        gameTd.setAttribute('result', 'tie');
                    }
                    gameTxt = document.createTextNode(result);
                    
                    divR.appendChild(gameTxt);
                    gameTd.appendChild(divR);
                    gameTr.appendChild(gameTd);
                    
                    //append the table row to the table body
                    gameTBody.appendChild(gameTr);
                }
            }
        })
    })

};

let populateTeamsTable = function(){
    let teamsTable = document.getElementById('teams');
    let thead = document.createElement('thead');
    let tbody = document.createElement('tbody');
    
    //appending thead/tbody to table
    teamsTable.appendChild(thead);
    teamsTable.appendChild(tbody);

    baller.getTeams(function(string, teams){
        if(string){
            alert(string);
        }
        else{
            //sort teams by score
            teams = sortTeams(teams);
            //header row
            let tr = document.createElement('tr');

            //city header
            let td = document.createElement('td')
            let txt = document.createTextNode('City');

            td.appendChild(txt)
            tr.appendChild(td);

            // name header
            td = document.createElement('td')
            txt = document.createTextNode('Name');

            td.appendChild(txt)
            tr.appendChild(td);

            //Wins
            td = document.createElement('td')
            txt = document.createTextNode('Wins');

            td.appendChild(txt)
            tr.appendChild(td);

            //Losses
            td = document.createElement('td')
            txt = document.createTextNode('Losses');

            td.appendChild(txt)
            tr.appendChild(td);

            //Ties
            td = document.createElement('td')
            txt = document.createTextNode('Ties');

            td.appendChild(txt)
            tr.appendChild(td);

            //points
            td = document.createElement('td')
            txt = document.createTextNode('Points');

            td.appendChild(txt)
            tr.appendChild(td);

            //finish header row
            thead.appendChild(tr);

            //create teamrows
            for(let i = 0; i < teams.length; i++){
                //new row
                tr = document.createElement('tr');
                //make a attribute of team id to read from when clicked on
                tr.setAttribute('team_id', teams[i].id);
                
                //when a team is clicked
                //want to clear the table or hide it to show the indiv table
                tr.addEventListener('click', createGamesTable);

                //city
                td = document.createElement('td');
                txt = document.createTextNode(teams[i].city);
                td.setAttribute('class', 'team-city-data');
                td.setAttribute('team_id', teams[i].id);

                td.appendChild(txt);
                tr.appendChild(td)

                //name
                td = document.createElement('td');
                txt = document.createTextNode(teams[i].name);
                td.setAttribute('class', 'team-name-data');
                td.setAttribute('team_id', teams[i].id);

                td.appendChild(txt);
                tr.appendChild(td);

                //wins
                td = document.createElement('td');
                txt = document.createTextNode(teams[i].stats.wins);
                td.setAttribute('team_id', teams[i].id);

                td.appendChild(txt);
                tr.appendChild(td); 

                //losses
                td = document.createElement('td');
                txt = document.createTextNode(teams[i].stats.losses);
                td.setAttribute('team_id', teams[i].id);
                td.appendChild(txt);
                tr.appendChild(td);

                //ties
                td = document.createElement('td');
                txt = document.createTextNode(teams[i].stats.ties);
                td.setAttribute('team_id', teams[i].id);
                td.appendChild(txt);
                tr.appendChild(td);

                //points
                td = document.createElement('td');
                txt = document.createTextNode((teams[i].stats.wins*2) +teams[i].stats.ties);
                td.setAttribute('team_id', teams[i].id);
                td.appendChild(txt);
                tr.appendChild(td);

                //finished with columns in the row of the tbody
                tbody.appendChild(tr);
            }
        
        }
    });
};