var m = require('moment');
import d = require('./main-defs');
import EditContext = require('../edit/edit-context');
var path = require('path');

import ui = require('./main-utils');
const g: any = global

var subscriber = Arda.subscriber<d.Props, d.State>((context, subscribe) => {
  subscribe('main:update-query', (query: string) => {
    context.update(s => {
      s.filterQuery = query;
    });
  });

  subscribe('main:ask-to-delete-all', () => {
    ui.askDeleteAll(context);
  });

  subscribe('main:open-files', () => {
    var dialog;
    try {
      dialog = g.require('remote').require('dialog');
    } catch(e) {
      dialog = g.require("electron").remote.dialog;
    }

    var fs = g.require('fs');
    var filepaths = dialog.showOpenDialog({
      filters: [
        {name: 'docs', extensions: ['md', 'markdown', 'txt']}
      ],
      properties: [ 'openFile', 'multiSelections' ]
    });

    if (filepaths && filepaths.length > 0) {
      Promise.all(filepaths.map(filepath => {
        var title = path.basename(filepath);
        var body = fs.readFileSync(filepath).toString();
        return kobito.commands.createNewItem(title, body, [], context.state.selectedTeamId);
      }))
      // .then((items: kobito.entities.Item[]) => {
      .then((items: any) => {
        context.update(s => {
          s.selectedItemId = items[0]._id;
        });
      });
    }
  });

  subscribe('main:export-selected-item', () => {
    var itemId = context.state.selectedItemId;
    if (itemId) {
      ui.exportItem(itemId);
    }
  });

  subscribe('main:export-item', itemId => {
    ui.exportItem(itemId);
  });

  subscribe('main:go-to-home', (query: string) => {
    context.update(s => {
      s.selectedItemId = null;
    });
  });

  subscribe('main:transition:to-editor-as-new-item', () => {
    // ignore in trash
    if (context.state.selectedTeamId === '#trash') {
      return;
    }

    kobito.commands.createNewItem('', '', [], context.state.selectedTeamId)
    .then(item => {
      context.state.selectedItemId = item._id;
      app.router.pushContext(EditContext, {itemId: item._id});
    });
  });

  subscribe('main:transition:to-editor-with-item', (itemId: string) => {
    // ignore in trash
    if (context.state.selectedTeamId === '#trash') {
      return;
    }

    app.router.pushContext(EditContext, {itemId: itemId, teamId: context.state.selectedTeamId});
  });

  subscribe('main:transition:to-login', () => {
    app.router.pushContext(require('../login/login-context'), {});
  });

  subscribe('main:transition:to-config', () => {
    app.router.pushContext(require('../config/config-context'), {});
  });

  subscribe('main:make-item-coedit', itemId => {
    var message = __('Are you sure to make this item coedit mode?\n(You can not revert it)');

    app.popup.showWithChoices(message, [
      {
        text: __('Yes'),
        onSelect: () => {
          kobito.commands.makeCoedit(itemId)
          .then(() => {
            Logger.log('Make it coedit:done');
            app.popup.close();
            context.update();
          })
          .catch(error => {
            Logger.log('Make it coedit:failed ' + error.message);
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

  subscribe('main:transition:to-editor-as-new-with-template', (templateId: string) => {
    // ignore in trash
    if (context.state.selectedTeamId === '#trash') {
      return;
    }

    app.popup.showLoader(__('Expanding...'));

    var teamId = context.state.selectedTeamId;
    kobito.qiita.fetchExpandedTemplate(teamId, templateId)
    .then(item => {
      kobito.commands.createNewItem(
        item.expanded_title,
        item.expanded_body,
        item.expanded_tags,
        teamId
      ).then(newItem => {
        // regsiter next selectedItemId
        context.state.selectedItemId = newItem._id;
        app.popup.close();
        app.router.pushContext(EditContext, {itemId: newItem._id, teamId: newItem.teamId});
      });
    })
    .catch(error => {
      app.popup.close();
      Logger.log(__('Failed to get templates'));
    });
  });

  subscribe('main:scroll-upper-in-preview', () => {
    var $preview = jQuery('.contentBody_preview');
    if ($preview.length === 0) {
      return;
    }
    $preview.scrollTop($preview.scrollTop() - 80);
  });

  subscribe('main:scroll-bottom-in-preview', () => {
    var $preview = jQuery('.contentBody_preview');
    if ($preview.length === 0) {
      return;
    }
    $preview.scrollTop($preview.scrollTop() + 80);
  });

  subscribe('main:sync-items', () => {
    // ignore in trash
    if (context.state.selectedTeamId === '#trash') {
      return;
    }

    var targetTeamId = context.state.selectedTeamId;
    kobito.queries.isLocalTeam(targetTeamId)
    .then(isLocalTeam => {
      if (!isLocalTeam) {
        var config = kobito.storages.singletons.Config.getInstance();
        var loginId = config.getLoginId();

        app.popup.showLoader("Now Syncing...");
        kobito.commands.sync.syncItems(targetTeamId)
        .then(() => {
          app.popup.close();
          context.update();
        })
        .catch(e => {
          app.popup.close();
          console.warn(e);
        });
      }
    });
  });

  subscribe('main:show-help', () => {
    app.track('show-help');
    app.popup.showHelp();
  });

  subscribe('main:open-search-popup', () => {
    app.popup.showSearch();
  });

  subscribe('main:focus-search', () => {
    context.update(s => {
      s.selectedItemId = null;
    })
    .then(() => {
      var c = context.getActiveComponent();
      c.refs.queryInput.refs.oneline.codemirror.focus();
    });
  });

  subscribe('toolbar:resolve-conflict-as-kobito', () => {
    kobito.commands.sync.resolveConflictAsKaita(context.state.selectedItemId)
    .then(() => {
      context.update();
    });
  });

  subscribe('toolbar:resolve-conflict-as-qiita', () => {
    kobito.commands.sync.resolveConflictAsQiita(context.state.selectedItemId)
    .then(() => {
      context.update();
    });
  });

  subscribe('help:feedback', () => {
    Env.openExternal('mailto:support@qiita.com');
  });
});

export = subscriber;
