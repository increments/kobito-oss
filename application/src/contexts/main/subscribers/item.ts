var m = require('moment');
import d = require('../main-defs');
import ui = require('../main-utils');
import common = require('../../common-actions');

var subscriber = Arda.subscriber<d.Props, d.State>((context, subscribe) => {
  subscribe('main:open-item', () => {
    // ignore in trash
    if (context.state.selectedTeamId === '#trash') {
      return;
    }

    if (context.state.selectedItemId) {
      app.router.pushContext(require('../../edit/edit-context'), {
        itemId: context.state.selectedItemId,
        teamId: context.state.selectedTeamId});
    }
  });

  function saveItemByCodeMirror() {
    var active = context.getActiveComponent();

    // if (active.refs.editor || active.refs.editor.codemirror) {
    if (!active.refs.editor) {
      return Promise.resolve(null);
    }
    var cm = active.refs.editor.codemirror;

    return Item.find(context.state.selectedItemId)
    .then(item => {
      var content = cm.getValue();
      var splitted = content.split('\n');
      var title = splitted[0];
      splitted.splice(0, 1);
      var body = splitted.join('\n');

      // update
      item.title = title || __('No Title');
      item.body = body || '';
      return kaita.commands.updateItem(item);
    });
  }

  subscribe('main:edit-item-inline', () => {
    // ignore in trash
    if (context.state.selectedTeamId === '#trash') {
      return;
    }

    if (context.state.selectedItemId) {
      context.update(s => {
        s.onEdit = true;
      }).then(() => {
        var active = context.getActiveComponent();
        var cm = active.refs.editor.codemirror;
        cm.on('blur', () => {
          saveItemByCodeMirror()
          .then(() => {
            context.update(s => {
              s.onEdit = false;
            });
          });
        });

        Item.find(context.state.selectedItemId)
        .then(item => {
          cm.setValue(item.title + '\n' + item.body);
          cm.clearHistory();
          cm.focus();
        });
      });
    }
  });

  subscribe('main:create-and-edit-inline', () => {
    // ignore in trash
    if (context.state.selectedTeamId === '#trash') {
      return;
    }
    kaita.commands.createNewItem('', '', [], context.state.selectedTeamId)
    .then(item => {
      context.update(s => {
        s.selectedItemId = item._id;
        s.onEdit = true;
      }).then(() => {
        var active = context.getActiveComponent();
        var cm = active.refs.editor.codemirror;
        cm.focus();
      });
    });
  });

  subscribe('markdown-editor:save', () => {
    saveItemByCodeMirror();
  });

  subscribe('markdown-editor:save-and-quit', () => {
    saveItemByCodeMirror()
    .then(() => {
      context.update(s => {
        s.onEdit = false;
      });
    });
  });

  subscribe('main:send-to-trash', (itemId: string) => {
    if (context.state.selectedTeamId === '#trash') {
      ui.askDelete(context, context.state.selectedItemId);
    } else {
      ui.askSendToTrash(context, context.state.selectedItemId);
    }
  });

  subscribe('main:send-selected-item-to-trash', () => {
    if (context.state.selectedItemId) {
      if (context.state.selectedTeamId === '#trash') {
        ui.askDelete(context, context.state.selectedItemId);
      } else {
        ui.askSendToTrash(context, context.state.selectedItemId);
      }
    }
  });

  subscribe('main:upload-item', (itemId: string) => {
    Team.find(context.state.selectedTeamId)
    .then(team => {
      if (team.local) {
        return;
      }

      return Item.find(itemId)
      .then(item => {
        if (!!item.syncedItemId) {
          return common.tryToUpload(itemId, {})
          .then(success => {
            context.update();
          });
        } else {
          return common.askToUpload(itemId)
          .then(allowed => {
            if (allowed) {
              return common.tryToUpload(itemId, {coediting: allowed.checkedForCoedit})
              .then(success => {
                context.update();
              });
            }
          });
        }
      })
      .catch(e => {
        context.update();
        console.error(e);
      });

    });
  });

  subscribe('main:upload-selected-item', () => {
    Team.find(context.state.selectedTeamId)
    .then(team => {
      if (team.local) {
        return;
      }

      var itemId = context.state.selectedItemId;
      if (!itemId) {
        return;
      }

      return Item.find(itemId)
      .then(item => {
        if (!!item.syncedItemId) {
          // already uploaded
          return common.tryToUpload(itemId, {}).then(success => {
            context.update();
          });
        } else {
          return common.askToUpload(itemId)
          .then(allowed => {
            if (allowed) {
              return common.tryToUpload(itemId, {}).then(success => {
                context.update();
              });
            }
          });
        }
      })
      .catch(e => {
        context.update();
        console.error(e);
      });
    });
  });

  // key actions
  subscribe('main:open-external-preview', () => {
    if (context.state.selectedItemId) {
      Env.openPreview(context.state.selectedItemId);
    }
  });

  subscribe('main:focus-first-item', () => {
    jQuery('.titleList_item_title:eq(0)').click();
  });

});

export = subscriber;
