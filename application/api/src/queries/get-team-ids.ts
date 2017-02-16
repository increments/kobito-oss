module kaita.queries {
  // return not inbox nor qiita
  export function getTeamIds(): Promise<string[]> {
    return Team.all()
    .then(teams => teams
      .filter(t => t._id !== 'qiita')
      .filter(t => !t.local)
      .map(t => t._id)
    );
  }
}
