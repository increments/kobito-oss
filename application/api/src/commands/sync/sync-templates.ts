module kobito.commands.sync {
  declare var Promise: any;
  export function syncAllTeamTemplates() {
    return queries.getTeamIds()
      .then(teamIds => Promise.all(teamIds.map(id => syncTemplates(id))));
  }

  export function syncTemplates(teamId: string): Promise<any> {
    return qiita.fetchTemplates(teamId)
    .then(items => {
      var itemsToSave: kobito.entities.Template[] = items.map((i, index) => {
        return {
          _id: teamId + ':' + i.id.toString(),
          staticId: i.id.toString(),
          name: i.name,
          body: i.body,
          tags: i.tags,
          title: i.title,
          teamId: teamId,
          index: index
        };
      });
      return Template.save(itemsToSave);
    })
    .catch(e => {
      console.error('template fetch error', e);
      return Promise.resolve();
    });
  }
}
