module kobito.commands.sync {
  export function syncTeams(): Promise<any> {
    return qiita.fetchTeams()
    .then(teams => {
      var teamsWillSave = teams.map(t => ({
        _id: t.id,
        name: t.name,
        local: false
      }))
      .concat([{name: 'Qiita', _id: 'qiita', local: false}]);
      return Team.save(teamsWillSave);
    });
  }

  export function dropRemovedTeams(): Promise<any> {
    return queries.detectRemovedTeamIds()
    .then(removedTeamIds => {
      return Promise.all(removedTeamIds.map(teamId => dropTeam(teamId)));
    });
  }

  export function dropTeam(teamId: string): Promise<any> {
    return Item.select(i => i.teamId === teamId)
    // remove items
    .then(items => {
      // TODO: avoid [] removing
      if (items.length === 0) {
        return Promise.resolve();
      }

      var itemIdsToRemove = items.map(i => i._id);
      return Item.remove(itemIdsToRemove);
    })
    // remove team
    .then(() => Team.remove(teamId));
  }

}
