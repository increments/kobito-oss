module kobito.commands {
  export function makeCoedit(itemId: string)
  : Promise<any> {
    // check item is latest or uploadable
    return Item.find(itemId)
    .then(item => {
      return kobito.qiita.fetchItem(
        item.teamId,
        item.syncedItemId
      )
      .then((qItem: Qiita.Entities.Item) => {
        // try to sync with remote item
        return kobito.commands.sync.syncItem(qItem, item.teamId);
      })
      .then(result => {
        if (
          result.result === kobito.commands.sync.SyncItemResultStatus.UPDATE ||
          result.result === kobito.commands.sync.SyncItemResultStatus.CONFLICT
        ) {
          return Promise.reject(new Error('conflict detected'));
        } else {
          // start make coedit
          item.coediting = true;
          return Item.save(item)
          .then(newItem => {
            return qiita.updateItem(itemId, newItem.teamId);
          });
        };
      });
    });
  }
}
