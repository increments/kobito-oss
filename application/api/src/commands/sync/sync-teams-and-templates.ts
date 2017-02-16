module kaita.commands.sync {
  function syncTeamTemplates(teamIds: string[]) {
    return teamIds.map(teamId => syncTemplates(teamId));
  }

  export function syncTeamsAndTemplates(): Promise<any> {
    app.track('sync-teams-and-templates');

    (<any>Qiita).setEndpoint('https://qiita.com');
    return Promise.resolve(ensureUserId())
    .then(() => syncTeams())
    .then(teams => queries.getTeamIds())
    .then(teamIds => syncTeamTemplates(teamIds));
  }
}
