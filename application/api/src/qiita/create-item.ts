module kaita.qiita {
  var m = require('moment');

  export interface CreateItemOptions {
      private?: boolean;
      coediting?: boolean;
      gist?: boolean;
      tweet?: boolean;
  }
  export function createItem(itemId, teamId, options: CreateItemOptions = {}): Promise<any> {
    return new Promise((done, reject) => {
      Item.find(itemId).then(item => {
        setEndpoint(teamId);

        Qiita.Resources.Item.create_item(<any>{
          title: item.title,
          body: item.body,
          tags: item.tags,
          private: options.private || false,
          coediting: options.coediting || false,
          gist: options.gist || false,
          group_url_name: item.group && item.group.url_name,
          tweet: options.tweet || false
        })
        .then(qItem => {
          // Add syncedItemId and save to db
          item.syncedItemId = qItem.id;
          var now = m().unix();
          item.local_updated_at = now;
          item.synced_at = now;
          item.group = qItem.group;
          item.coediting = options.coediting || false;
          item.remote_updated_at = m(qItem.updated_at).unix();
          app.track('qiita:create-item', {isQiita: teamId === 'qiita'});
          return kaita.commands.updateItem(item).then(done);
        })
        .catch(e => {
          reject(e);
        });
      });
    });
  };
}
