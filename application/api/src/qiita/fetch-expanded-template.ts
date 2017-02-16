module kaita.qiita {
  export function fetchExpandedTemplate(teamId: string, templateId: string)
  // : Promise<Qiita.Entities.ExpandedTemplate> // TODO: Fix this annotation
  : Promise<any> {
    return kaita.queries.isLocalTeam(teamId)
    .then(isLocal => {
      if (isLocal) {
        return (<any>Promise).reject(new Error('Local team cant sync'));
      }

      setEndpoint(teamId);
      return Template.first(
        t => t.teamId === teamId
          && t.staticId === templateId)
      .then(template => {
        return Qiita.Resources.ExpandedTemplate.create_expanded_template({
          title: template.title,
          body: template.body,
          tags: template.tags
        }).then(result => {
          app.track('qiita:expand-temaplate');
          return Promise.resolve(result);
        });
      });
    });
  }
}
