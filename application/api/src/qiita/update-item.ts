module kaita.qiita {
  var m: any = require('moment');

  export function updateItem(itemId: string, teamId: string) {
  // : Promise<any> {*/
    app.track('qiita:update-item');

    return Item.find(itemId)
    .then(item => {
      if (!item.syncedItemId) {
        return Promise.reject(new Error('sync item id not set'));
      }

      setEndpoint(teamId);
      return Qiita.Resources.Item.update_item(item.syncedItemId, {
        title: item.title,
        body: item.body,
        tags: item.tags,
        group_url_name: item.group && item.group.url_name,
        private: false,
        coediting: item.coediting || false
      })
      .then((result: any) => {
        if (!result.updated_at) {
          return Promise.reject(new Error('Update failed'));
        }
        var now = m().unix();
        item.local_updated_at = now;
        item.synced_at = now;
        item.remote_updated_at = m(result.updated_at).unix();
        return (<any>kaita).commands.updateItem(item);
      });
    });
  };
}
