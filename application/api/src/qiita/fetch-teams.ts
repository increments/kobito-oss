module kaita.qiita {
  export function fetchTeams() {
  // : Promise<{name: string; id: string;}[]> {*/
    qiita.setEndpoint('qiita');
    return Qiita.Resources.Team.list_teams()
    .then(teams => {
      return teams.filter(t => t.active);
    });
  };
}
