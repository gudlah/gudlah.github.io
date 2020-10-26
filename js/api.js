const base_url = 'https://api.football-data.org/v2/';
function status(response) {
  if(response.status !== 200) {
    console.log('Error : ' + response.status);
    return Promise.reject(new Error(response.statusText));
  } else {
    return Promise.resolve(response);
  }
}
function json(response) {
  return response.json();
}
function error(error) {
  console.log(`Error : ${error}`);
}
function fetchApi(url) {
  return fetch(url, {
    headers: {
      'X-Auth-Token': '66d3899ff93c47528ac50ca6341712bd'
    }
  })
}
function getLeagues() {
  if('caches' in window) {
    caches.match(`${base_url}competitions`).then(response => {
      if(response) {
        response
          .json()
          .then(leagues => {
            domDashboard(leagues);
          })
      }
    })
  }
  fetchApi(`${base_url}competitions`)
    .then(status)
    .then(json)
    .then(leagues => {
      domDashboard(leagues);
    })
}
function getSavedLeagues() {
  getAll().then(leagues => {
    if(leagues.length === 0) {
      document.getElementById('saved-leagues').innerHTML = nullSavedLeaguesHTML();
    } else {
      delShow();
      document.getElementById('saved-leagues').innerHTML = leaguesHTML(leagues, 1);
    }
  });
}
function getLeagueById() {
  return new Promise((resolve, reject) => {
    const idParam = new URLSearchParams(window.location.search).get('id');
    if('caches' in window) {
      caches.match(`${base_url}competitions/${idParam}/matches?status=SCHEDULED`)
        .then(response => {
            if(response) {
              response.json().then(data => leagueByIdHTML(data));
            }
          });
    }
    fetchApi(`${base_url}competitions/${idParam}/matches?status=SCHEDULED`)
      .then(status)
      .then(json)
      .then(league => {
        const data = susunObjek(league);
        leagueByIdHTML(data);
        resolve(data);
      });
  });
}
function currentSeasonId(id) {
  return new Promise((resolve, reject) => {
    if('caches' in window) {
      caches.match(`${base_url}competitions/${id}`)
        .then(league => league.currentSeason);
    }
    fetchApi(`${base_url}competitions/${id}`)
      .then(status)
      .then(json)
      .then(league => resolve(league.currentSeason))
  })
}
function getSavedLeagueById() {
  const idParam = parseInt(new URLSearchParams(window.location.search).get('id'));
  getById(idParam).then(data => leagueByIdHTML(data));
}
