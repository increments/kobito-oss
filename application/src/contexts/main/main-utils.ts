var m = require('moment');
import d = require('./main-defs');

var pkg = require('../../../package.json');
const g: any = global;

import SyncItemResultStatus = kobito.commands.sync.SyncItemResultStatus;
export function syncItemsIfNotExistWithCover(targetTeamId: string, context) {
  return kobito.queries.isLocalTeam(targetTeamId)
  .then(isLocalTeam => {
    // skip if local team
    if (isLocalTeam) {
      return;
    }

    return Item.select(i => i.teamId === targetTeamId)
    .then(items => {
      if (items.length !== 0) {
        return;
      }
      Logger.log('Start fetching:' + targetTeamId);
      return kobito.commands.sync.syncItems(targetTeamId)
      .then(results => {
        var counters = _.countBy(results, item => item.result);
        // TODO: count
        Logger.log('Fetching done');
        context.update();
        app.popup.close();
      });
    })
    .catch(e => {
      app.popup.close();
      Logger.log(__('Failed to fetch'));
    });
  });
}

export function getSelectedItem(teamId, itemId, amount = 0) {
  return new Promise(done => {
    Item.select(i => i.teamId === teamId)
    .then(items => {
      items = _.sortBy(items, i => - i.created_at);
      var nextCursorId;
      if (itemId) {
        // select nect item
        var cursorIndex = _.findIndex(items, i => i._id === itemId);
        if (items[cursorIndex + amount] == null) {
          return;
        }
        nextCursorId = items[cursorIndex + amount]._id;
        done(nextCursorId);
        // TODO: scroll container
      } else {
        if (items.length > 0) {
          nextCursorId = items[0]._id;
          done(nextCursorId);
        } else {
          done(null);
        }
      }
    });
  });
}

export function findOrCreateItem(teamId: string, itemId?: string)
: Promise<kobito.entities.Item> {
  if (!teamId) {
    throw new Error('need teamId if create new item');
  }

  return new Promise<kobito.entities.Item>(done => {
    if (itemId == null) {
      // create
      kobito.commands.createNewItem('', '', [], teamId)
      .then(item => done(item));
    } else {
      // find
      Item.find(itemId).then(item => {
        if (item == null) {
          throw new Error('This item doesnt exist:' + itemId);
        }
        done(item);
      });
    }
  });
}

export function tryToUpdateTeamsAndTemplates(context) {
  if (app.config.getAPIToken()) {
    kobito.commands.sync.syncTeams()
    .then(() => kobito.queries.detectRemovedTeamIds())
    .then(removedTeamIds => {
      return new Promise(done => {
        if (removedTeamIds.length === 0) {
          done(false);
        } else {
          var message = "以下のチームは削除されています。\n\n" + removedTeamIds.join('\n');
          app.popup.showWithChoices(message, [
            {
              text: __('記事をすべて削除'),
              onSelect: () => {
                kobito.commands.sync.dropRemovedTeams()
                .then(() => done(true));
              }
            },
            {
              text: __('記事をすべてInboxに送る'),
              onSelect: () => {
                (<any>Promise).all(
                  removedTeamIds.map(id => {
                    return kobito.commands.transferItems(id, '#inbox');
                  })
                )
                .then(() => done(true));
              }
            }
          ]);
        }
      });
    })
    .then(teamChanged => {
      if (teamChanged) {
        app.popup.close();
        return kobito.commands.sync.syncAllTeamTemplates()
        .then(() => {
          app.config.setLastTeamId('#inbox');
          context.state.selectedTeamId = '#inbox';
          return context.updateTeamsAndTemplates();
        });
      }
    })
    .catch(e => {
      Logger.warn(__('Failed to get teams info'));
    });
  }
}

export function askSendToTrash(context, itemId: string) {
  if (itemId == null) {
    return;
  }

  Item.find(itemId)
  .then(item => {
    var message = __('Are you sure to send this item to Trash?')
      + ' : \'' + (item.title || __('No Title')) + '\'';

    return app.popup.showWithChoices(message, [
      {
        text: __('Yes'),
        onSelect: () => {
          kobito.commands.sendToTrash(itemId)
          .then(() => {
            context.update(s => {
              s.selectedItemId = null;
            });
            app.popup.close();
          });
        }
      },
      {
        text: __('No'),
        onSelect: () => {
          app.popup.close();
        }
      }
    ]);
  });
}

export function askDelete(context, itemId: string) {
  if (itemId == null) {
    return;
  }

  Item.find(itemId)
  .then(item => {
    var title = item.title || __('No Title');
    var message = __('Are you sure to delete this item?') + ' \'' + title + '\'';

    if (!!item.syncedItemId) {
      message += '\n' + __('(It doesn\'t effect to Qiita/Qiita:Team)');
    } else {
      message += '\n' + __("(You can\'t cancel it)");
    }

    return app.popup.showWithChoices(message, [
      {
        text: __('Yes'),
        onSelect: () => {
          kobito.commands.deleteItem(itemId)
          .then(() => {
            context.update(s => {
              s.selectedItemId = null;
            });
            app.popup.close();
          });
        }
      },
      {
        text: __('No'),
        onSelect: () => {
          app.popup.close();
        }
      }
    ]);
  });
}

export function askDeleteAll(context) {
  var message = __('Are you sure to delete all items in Trash?');
  message += '\n' + __('(It does not effect to Qiita/Qiita:Team');

  return app.popup.showWithChoices(message, [
    {
      text: __('Yes'),
      type: 'danger',
      onSelect: () => {
        kobito.commands.deleteItemsInTrash()
        .then(() => {
          context.update(s => {
            s.selectedItemId = null;
          });
          app.popup.close();
        });
      }
    },
    {
      text: __('No'),
      onSelect: () => {
        app.popup.close();
      }
    }
  ]);
}

export function exportItem(itemId) {
  var fs = g.require('fs');
  Item.find(itemId)
  .then(item => {
    var filepath = g.require('remote').require('dialog').showSaveDialog({
      title: __('Save')
    });
    if (filepath) {
      try {
        fs.writeFileSync(filepath, item.title + '\n' + item.body);
        Logger.log(__("Saved as {}", filepath));
      } catch (e) {
        Logger.log(__("Failed to save as {}", filepath));
      }
    }
  });
};
