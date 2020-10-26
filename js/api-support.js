function delShow() {
  document.querySelector('.spinner').classList.remove('show');
}
function susunObjek(league) {
  data = {
    id: league.competition.id,
    name: league.competition.name,
    matches: []
  }
  const saatIni = new Date().getTime();
  const semingguKedepan = new Date().getTime()+(60000*60*24*7);
  league.matches.forEach(e => {
    const timeMatch = new Date(e.utcDate.split('T')[0]).getTime();
    if(timeMatch <= semingguKedepan && timeMatch >= saatIni) {
      data.matches.push(e);
    }
  });
  currentSeasonId(league.competition.id).then(cs => {
    data.currentSeason = cs;
  });
  return data;
}
function susunLeagues(leagues) {
  const competitions = [];
  leagues.competitions.forEach(league => {
    if(league.id === 2003 || league.id === 2002 || league.id === 2021 || league.id === 2014 || league.id === 2015 || league.id === 2016) {
      competitions.push(league);
    }
  });
  leagues.competitions = competitions;
  return leagues;
}
function leaguesHTML(leagues, saved = null) {
  let leaguesHTML = '';
  leagues.forEach(league => {
    leaguesHTML += leaguesElement(league, saved);
  });
  return leaguesHTML;
}
function domDashboard(leagues) {
  delShow();
  document.getElementById('leagues').innerHTML = leaguesHTML(susunLeagues(leagues).competitions);
}
function leagueByIdHTML(data) {
  delShow();
  document.querySelector('table').style.visibility = 'visible';
  document.getElementById('header-content').innerHTML = headerElement(data);
  let matchesHTML = '';
  data.matches.forEach(e => {
    matchesHTML += matchesElement(e);
    document.querySelector('.match').innerHTML = matchesHTML;
  });
}
function headerElement(data) {
  return `<div class="card row">
    <div class="col l3 m3 s12 card-image">
      <img src="img/leagues/${data.id}.png">
    </div>
    <div class="col l9 m9 s12">
      <h2 class="bold center-align">${(data.name === 'Championship')? 'Champion League' : data.name}</h2>
    </div>
  </div>`;
}
function matchesElement(data) {
  return `<tr>
    <td>
      <img src="https://crests.football-data.org/${data.homeTeam.id}.svg">
    </td>
    <td>${data.homeTeam.name}</td>
    <td>
      ${data.utcDate.split('T')[0]}<br>${data.utcDate.split('T')[1].split('Z')[0]}
    </td>
    <td>${data.awayTeam.name}</td>
    <td><img src="https://crests.football-data.org/${data.awayTeam.id}.svg"></td>
  </tr>`;
}
function nullSavedLeaguesHTML() {
  return `
    <div class="col l3 m2 s1"></div>
    <div class="col l6 m8 s10 red lighten-1 nothing grey-text text-lighten-5">No Saved Leagues</div>
    <div class="col l3 m2 s1"></div>
  `;
}
function leaguesElement(league, saved) {
  return `<div class='col l4 m6 s12'>
    <a href='./matches.html?id=${league.id}${(saved)? '&saved=true' : ''}'>
      <div class="card">
        <div class='card-image waves-effect waves-block waves-light'>
          <img src='/img/leagues/${league.id}.png' />
        </div>
        <div class="card-content">
          <hr>
          <p>${league.currentSeason.startDate.replaceAll("-", "/")} - ${league.currentSeason.endDate.replaceAll("-", "/")}</p>
          <p>Matchday : ${league.currentSeason.currentMatchday}</p>
        </div>
      </div>
    </a>
  </div>`;
}