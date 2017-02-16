module kaita.commands.sync {
  var m: any = require('moment');

  import QiitaItem = Qiita.Entities.Item;

  export enum SyncItemResultStatus {
    PASS,
    NEW,
    UPDATE,
    CONFLICT,
  }

  export interface SyncItemResult {
    result: SyncItemResultStatus;
    itemId?: string;
  }

  function saveNewItemFromQiitaItem(
    qItem: QiitaItem,
    teamId: string,
    timestamp
  ): Promise<kaita.entities.Item> {
    // Remove cache before add
    kaita.queries.removeLastTimelineCache();
    var savedItem: entities.Item = {
      title: qItem.title,
      body: qItem.body,
      compiled_body: utils.compileMarkdown(qItem.body),
      tags: qItem.tags,
      group: (<any>qItem).group,
      syncedItemId: qItem.id,
      teamId: teamId,
      created_at: m(qItem.created_at).unix(),
      remote_updated_at: m(qItem.updated_at).unix(), // update sync date
      local_updated_at: timestamp, // update sync date
      synced_at: timestamp,
      conflict_item: null
    };
    return Item.save(savedItem);
  }

  function updateItemByQiitaItem(
    item: kaita.entities.Item,
    qItem: QiitaItem,
    timestamp
  ): Promise<kaita.entities.Item> {
    // update props
    item.title = qItem.title;
    item.body = qItem.body;
    item.tags = qItem.tags;
    item.syncedItemId = qItem.id;
    item.created_at = m(qItem.created_at).unix();
    item.remote_updated_at = m(qItem.updated_at).unix();
    item.local_updated_at = timestamp;
    item.synced_at = timestamp;
    item.group = (<any>qItem).group;
    item.conflict_item = null;
    item.compiled_body = utils.compileMarkdown(item.body);
    return Item.save(item);
  }

  export function resolveConflictAsQiita(itemId: string) {
    // Remove cache before add
    kaita.queries.removeLastTimelineCache();

    app.track('resolve-conflict-as-qiita');

    return Item.find(itemId)
    .then(item => updateItemByQiitaItem(item, item.conflict_item, m().unix()));
  }

  export function resolveConflictAsKaita(itemId: string) {
    // Remove cache before add
    kaita.queries.removeLastTimelineCache();
    app.track('resolve-conflict-as-kaita');

    return Item.find(itemId)
    .then(item => {
      item.conflict_item = null;
      item.compiled_body = utils.compileMarkdown(item.body);
      return updateItem(item);
    })
    .then(item => {
      return kaita.qiita.updateItem(item._id, item.teamId);
    });
  }

  export function syncItem(qItem: QiitaItem, teamId: string) {
  // : Promise<SyncItemResult> {*/
    // Remove cache before add
    kaita.queries.removeLastTimelineCache();
    var remote_updated_at = m(qItem.updated_at).unix();
    return Item.first(i => i.syncedItemId === qItem.id)
    .then(item => {
      var now = m().unix();
      // create new if item does not exist
      if (item == null) {
        return saveNewItemFromQiitaItem(qItem, teamId, now)
        .then(item => ({
          result: SyncItemResultStatus.NEW,
          itemId: item._id
        }));
      }

      // do nothing if item is not changed on remote
      // but if qiita item has group, update it silently
      if (item.remote_updated_at === remote_updated_at) {
        if (item.group == null && (<any>qItem).group) {
          item.group = (<any>qItem).group;
          return updateItem(item)
          .then(item => ({
            result: SyncItemResultStatus.PASS,
            itemId: item._id
          }));
        } else {
          return {
            result: SyncItemResultStatus.PASS,
            itemId: item._id
          };
        }
      }

      // detect confliction
      // update or mark as conflict
      if (
        item.local_updated_at > item.synced_at // update on local
        && remote_updated_at > item.synced_at // update on server
      ) {
        // mark as confict
        app.track('detect-confict');

        item.conflict_item = qItem;
        return Item.save(item)
        .then(item => ({
          result: SyncItemResultStatus.CONFLICT,
          itemId: item._id
        }));
      } else if (item.local_updated_at > item.synced_at) {
        // pass if only local is changed
        return {
          result: SyncItemResultStatus.PASS,
          itemId: item._id
        };
      } else {
        // update normally
        return updateItemByQiitaItem(item, qItem, now)
        .then(item => ({
          result: SyncItemResultStatus.UPDATE,
          itemId: item._id
        }));
      }
    });
  }

  var _syncLock = false;
  export function syncItems(teamId: string): Promise<SyncItemResult[]> {
    if (_syncLock) {
      return Promise.resolve([]);
    }
    _syncLock = true;

    // Remove cache before add
    kaita.queries.removeLastTimelineCache();

    app.track('sync-items');
    return ensureUserId()
      .then(id => kaita.qiita.fetchLoginUserItems(teamId))
      .then((qItems: any) => Promise.all(qItems.map(qItem => syncItem(qItem, teamId))))
      .then(results => {
        _syncLock = false;
        return results;
      });
  }
}
