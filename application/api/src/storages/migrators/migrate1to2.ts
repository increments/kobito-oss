// Update dbVersion from 1 to 2
// 1. Remove Team#id
// 2. Add local flag to #index
// 3. Add #trash team as local

// () => Promise<any>
module kaita.storages.migrators {
  export function migrate1to2() {
    return global.Team.all()
    .then(teams => {
      var nextTeams = teams.map(t => ({
        _id: t._id,
        name: t.name,
        local: (t._id === '#inbox')
      }));
      nextTeams.push({
        _id: '#trash',
        name: 'Trash',
        local: true
      });
      return global.Team.save(nextTeams);
    });
  }
}
