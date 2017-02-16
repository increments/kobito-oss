module kaita.qiita {
  export function fetchTemplates(teamId: string) {
  // : Promise<Qiita.Entities.Template[]>
    return kaita.queries.isLocalTeam(teamId)
    .then(isLocalTeam => {
      if (isLocalTeam) {
        return Promise.reject(new Error('Inbox cant sync'));
      }

      setEndpoint(teamId);
      // TODO: fetch more than 100
      return (<any>Qiita).Resources.Template.list_templates({
        page: '1', per_page: '100'
      })
      .catch(e => {
        return [];
      });
    });
  }
}
