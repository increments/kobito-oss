module kobito.queries {
  export function isLocalTeam(teamId: string)
  : Promise<boolean> {
    return Team.find(teamId)
    .then(team => team.local);
  }
}
