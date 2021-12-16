
let baller = (function() {
    let prefix = ["", "Red", "Blue", "Green", "Flying", "Rushing", "Running", "Orange", "Granite", "Relentless", "Smash-Mouth", "Demanding", "Unflinching", "Hard Hitting", "Stoney", "Fiery", "Burning", "Righteous", "Sweet", "Neon", "Fierce", "Fantastic", "Inquisitive", "Magnificent", "Zealous", "Tough", "Aggressive", "Berserking", "Belligerent", "Beefy", "Dapper", "Delightful", "Fearless", "Glorious", "Gray", "Garrulous", "Hissing", "Incredible", "Invincible", "Livid", "Organic", "Upstanding", "Impeccable", "Quick-footed", "Savory", "Unbecoming"];
    let names = ["Rams", "Tigers", "Sharks", "Peppers", "Herd", "Dogs", "Mentors", "Hawks", "Strikers", "Lions", "Brawlers", "Peas", "Pugilists", "Warriors", "Skeletons", "Zombies", "Turtles", "Hornets", "Tree Frogs", "Oaks", "Pythons", "Zebras", "Daisies", "Peacocks", "Militia", "Soldiers", "Volunteers", "Brick-Layers", "Miners", "Astronauts", "Pistols", "Popcorn Hurlers", "Accountants", "Farmers", "Bean Baggers", "Tree Rats", "Bluffers"];
    let cities = ["La Crosse", "Winona", "La Crescent", "Westby", "Greenfield", "Onalaska", "West Salem", "Sparta", "Tomah", "Viroqua", "Center Point", "Strawberry Point", "Alton", "Shelby", "Elroy", "Hillsboro", "Oseo", "Janesville", "Stoddard", "Chaseberg", "Brownsfille", "Viola", "Penny Creek", "Oakdale", "Ridgeview", "Liberty Ocean", "Sylvus", "Reno", "Steuben", "Bell Center", "Gays Mills", "Soldiers Grove", "Readstown", "Dorchest", "Eitzen"];
    let divisions = ["Central", "North", "South", "East", "West", "South West", "North County", "GET", "Urban District", "South East", "North West", "North Central"];
  
    function shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * i)
        const temp = array[i]
        array[i] = array[j]
        array[j] = temp
      }
      return array;
    }
  
    function randomColor() {
      var letters = '0123456789ABCDEF';
      var color = '#';
      for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }
  
    function repeat(f, n) {
      let result = [];
      while (n) {
        result.push(f());
        n--;
      }
      return result;
    }
  
    let choose = function(vals) {
      let i = Math.floor(Math.random() * vals.length);
      return vals[i];
    }
  
    randomTeamName = function() {
      return choose(prefix) + " " + choose(names);
    }
  
    randomDate = function() {
      //year = Math.floor(Math.random() * 10 + 2005);
      year = 2020;
      month = Math.floor(Math.random() * 12);
      day = Math.floor(Math.random() * 31);
      return new Date(year, month, day);
    };
  
    randomId = function() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }
  
    function Team(name, teamColor, city, division) {
      this.id = randomId();
      this.name = name;
      this.teamColor = teamColor;
      this.city = city;
      this.division = division;
    }
  
    function Game(home, away, homeScore, awayScore, date, night) {
      this.id = randomId();
      this.home = home;
      this.away = away;
      this.homeScore = homeScore;
      this.awayScore = awayScore;
      this.date = date;
      this.night = night;
    }
  
    function indices(n) {
      let result = [];
      for (let i = 0; i < n; i++) {
        result.push(i);
      }
      return result;
    }
  
    function createTeams(n, d) {
      let _prefixes = shuffle(prefix).slice(0, n);
      let _names = shuffle(names).slice(0, n);
      let _cities = shuffle(cities).slice(0, n);
      let _divisions = shuffle(divisions).slice(0, d);
      let _colors = repeat(randomColor, n);
  
      return indices(n).map(i => {
        return new Team(_prefixes[i] + " " + _names[i], _colors[i], _cities[i], choose(divisions));
      });
    }
  
    function createGames( teams, n ) {
     let result = []
     teams.forEach( home => {
        for( let i = 0; i < n; i++ ) {
          let away = choose( teams );
          while( home.id == away.id ) away = choose( teams );
          let homeScore = Math.floor( Math.random() * 7 );
          let awayScore = Math.floor( Math.random() * 7 );
          result.push( new Game( home, away, homeScore, awayScore, randomDate(), Math.random() < .75 ) );
        }
      });
     return result;
    }
  
    function getStats( teamId, games ) {
      games = games.filter( g => g.home.id == teamId || g.away.id == teamId );
      let result = { wins: 0, losses : 0, ties : 0 };
      games.forEach( game => {
        let mine = game.home.id == teamId ? 'homeScore' : 'awayScore';
        let other = mine == 'homeScore' ? 'awayScore' : 'homeScore';
        if( game[ mine ] > game[ other ] ) {
          result.wins++;
        } else if( game[mine] < game[other] ) {
          result.losses++;
        } else {
          result.ties++;
        }
      });
  
      console.log( result );
      return result;
    }
  
    let teams = createTeams(Math.floor(Math.random() * 12 + 6), Math.floor(Math.random() * 3 + 2));
    let games = createGames( teams, Math.floor( Math.random() * 10 + 5 ) );
  
    teams.forEach( t => t.stats = getStats( t.id, games ) );
  
  
    return {
      getTeam: (tid, cb) => setTimeout( () => {
        let result = teams.filter( t => t.id == tid )[0];
        cb( null, result );
      }, Math.random() * 3000  ),
      getTeams: (cb) => setTimeout( () => { 
        let result = teams.slice(0, teams.length);
        cb( null, result );
      }, Math.random() * 3000 ),
      getGames: (tid, cb) => setTimeout( () => {
        let result = games.filter( g => g.home.id == tid || g.away.id == tid );
        cb( null, result );
      }, Math.random() * 3000)
    }
  })();