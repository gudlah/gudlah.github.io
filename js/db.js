const dbPromised = idb.open('league-list', 1, upgradeDb => {
	upgradeDb.createObjectStore('leagues', { keyPath: 'id' }).createIndex('idTeam', 'id', { unique: false });
});
function saveForLater(league) {
  dbPromised
    .then(db => transaction(db, 'readwrite').put(league).complete)
    .then(() => M.toast({html: 'Data has been saved!'}));
}
function getAll() {
  return new Promise((resolve, reject) => {
    dbPromised
      .then(db => transaction(db, 'readonly').getAll())
      .then(leagues => resolve(leagues));
  });
}
function getById(id) {
  return new Promise((resolve, reject) => {
    dbPromised
      .then(db => transaction(db, 'readonly').get(id))
      .then(league => resolve(league));
  });
}
function delById(id) {
  return new Promise((resolve, reject) => {
    dbPromised
      .then(db => transaction(db, 'readwrite').delete(id).complete)
      .then(() => console.log('Item deleted!'));
  });
}
function transaction(db, access) {
  return db.transaction('leagues', access).objectStore('leagues');
}