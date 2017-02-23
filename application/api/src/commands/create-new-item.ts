module kobito.commands {
  var m: any = require('moment');
  export function createNewItem(
    title: string,
    body: string,
    tags: entities.Tag[],
    teamId: string
  ) : Promise<entities.Item> {
    // Remove cache before add
    kobito.queries.removeLastTimelineCache();
    app.track('create-new-item');

    var now = m().unix();
    var item: entities.Item = {
      title: title,
      body: body,
      compiled_body: utils.compileMarkdown(body),
      tags: tags,
      teamId: teamId,
      created_at: now,
      local_updated_at: now
    };

    return Item.save(item);
  }
}
