module kaita.queries {
  export function detectRemovedTeamIds(): Promise<string[]> {
    return queries.getTeamIds()
    .then(currentTeamIds => {
      // Need to set qiita to fetch teams correctly
      qiita.setEndpoint('qiita');
      return qiita.fetchTeams()
      .then(serverTeams => {
        var serverTeamIds = (<any>serverTeams).map(t => t.id);
        var removedTeamIds = [];

        // search team id not in server
        currentTeamIds.forEach(id => {
          if (!_.includes(serverTeamIds, id)) {
            removedTeamIds.push(id);
          }
        });
        return removedTeamIds;
      });
    });
  }
}
