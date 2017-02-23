module kobito.qiita {
  export function fetchGroups(teamId: string): Promise<kobito.entities.Group[]> {
    if (teamId === 'qiita') {
      return Promise.reject(new Error('Cannot fetch groups from qiita'));
    }

    return kobito.queries.isLocalTeam(teamId)
    .then(isLocalTeam => {
      if (isLocalTeam) {
        return Promise.reject(new Error('Cannot fetch usernames from local team'));
      }

      setEndpoint(teamId);
      return (<any>Qiita.Resources).AuthenticatedUser.groups();
    });
  }
}
