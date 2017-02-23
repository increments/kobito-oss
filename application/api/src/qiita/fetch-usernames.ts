module kobito.qiita {
  export function fetchUsernames(teamId: string) {
    if (teamId === 'qiita') {
      return Promise.reject(new Error('Cannot fetch usernames from qiita'));
    }

    return kobito.queries.isLocalTeam(teamId)
    .then(isLocalTeam => {
      if (isLocalTeam) {
        return Promise.reject(new Error('Cannot fetch usernames from local team'));
      }

      setEndpoint(teamId);
      return (<any>Qiita).Resources.ExpandedTemplate.create_expanded_template({
        body: "%{mention}", tags: [], title: ''
      })
      .then(template => {
        return template.expanded_body.replace(/@/g, '').split(' ');
      });
    });
  }
}
