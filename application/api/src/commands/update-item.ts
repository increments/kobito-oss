module kaita.commands {
  var m = require('moment');
  export function updateItem(item: entities.Item) {
    // Remove cache before add
    kaita.queries.removeLastTimelineCache();

    app.track('update-item');

    item.local_updated_at = m().unix();
    item.compiled_body = utils.compileMarkdown(item.body);
    return Item.save(item);
  }
}
