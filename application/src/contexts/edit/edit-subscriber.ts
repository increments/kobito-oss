declare var Mousetrap: any;
var _ = require('lodash');
import d = require('./edit-defs');
import utils = require('./edit-utils');
var buildMenu = require('../../utils/build-menu');
import common = require('../common-actions');

// group name by team
var GroupCacheByTeam: any = {};

var subscriber = Arda.subscriber<d.Props, d.State>((context, subscribe) => {

  subscribe('context:started', (props: d.Props) => {
    buildMenu('edit');

    var teamId = context.state.item.teamId;
    if (GroupCacheByTeam[teamId]) {
      context.update(s => {
        s.groups = GroupCacheByTeam[teamId];
        return s;
      });
      return;
    };

    kobito.queries.isLocalTeam(teamId)
    .then(isLocalTeam => {
      if (!isLocalTeam && teamId !== "qiita") {
        kobito.qiita.fetchGroups(teamId).then(groups => {
          GroupCacheByTeam[teamId] = groups;
          context.update(s => {
            s.groups = groups;
            return s;
          });
        });
      }
    });
  });

  subscribe('context:disposed', (props: d.Props) => {
    Mousetrap.unpause();
  });

  subscribe('context:paused', () => {
    Mousetrap.unpause();
  });

  subscribe('edit:saveAndBack', () => {
    app.track('editor:save-and-back');
    utils.tryToSave(context)
    .then(report => {
      // TODO: handle error report
      var title = context.state.buffer.title;
      var body = context.state.buffer.body;
      if (title.length === 0 && body.length === 0) {
        Item.remove(context.props.itemId)
        .then(() => app.router.popContext());
      } else {
        app.router.popContext();
      }
    });
  });

  subscribe('edit:change-group', (groupUrlName: string) => {
    context.update(state => {
      var group = _.find(state.groups, group => group.url_name === groupUrlName);
      state.buffer.selectedGroup = group;
      return state;
    });
  });

  subscribe('edit:back-without-editing', () => {
    app.track('editor:back-without-editing');
    var itemId = context.props.itemId;
    var title = context.state.buffer.title;
    var body = context.state.buffer.body;
    if (title.length === 0 && body.length === 0) {
      Item.remove(itemId).then(() => app.router.popContext());
    } else {
      app.router.popContext();
    }
  });

  subscribe('markdown-editor:save', () => {
    utils.tryToSave(context)
    .then(report => {
      if (report.nextItem) {
        context.update(s => {
          s.item = report.nextItem;
          return s;
        });
      }
      Logger.log(report.message);
    });
  });

  subscribe('edit:save', () => {
    utils.tryToSave(context)
    .then(report => {
      if (report.nextItem) {
        context.update(s => {
          s.item = report.nextItem;
          return s;
        });
        Logger.log(report.message);
      }
    });
  });

  subscribe('markdown-editor:change', (code: string) => {
    var content = utils.parseBufferText(code);
    context.update(state => {
      state.buffer.title = content.title;
      state.buffer.body = content.body;
      state.canUpdate = utils.isItemTouched((<any>state.buffer), context.state.item);
      state.canUpload = utils.isItemUploadable(context.state.item);
    });
  });

  subscribe('markdown-editor:save-and-quit', () => {
    app.track('editor:save-and-quit');
    utils.tryToSave(context)
    .then(report => {
      // TODO: handle error report
      var title = context.state.buffer.title;
      var body = context.state.buffer.body;
      if (title.length === 0 && body.length === 0) {
        Item.remove(context.props.itemId)
        .then(() => app.router.popContext());
      } else {
        app.router.popContext();
      }
    });
  });

  subscribe('edit:updateTags', (tagText: string) => {
    var tags: kobito.entities.Tag[] = utils.parseTagString(tagText);
    context.update(state => {
      state.buffer.tags = tags;
      state.canUpdate = utils.isItemTouched((<any>state.buffer), context.state.item);
    });
  });

  subscribe('edit:upload', () => {
    app.track('editor:upload');
    var itemId = context.state.item._id;

    utils.tryToSave(context)
    .then(report => {
      return common.askToUpload(itemId);
    })
    .then(allowed => {
      if (!allowed) {
        return (<any>Promise).reject(new Error('user rejected'));
      } else {
        return common.tryToUpload(itemId, {coediting: allowed.checkedForCoedit});
      }
    })
    .then(isUploaded => {
      if (isUploaded) {
        return Item.find(context.state.item._id)
        .then(item => {
          context.update(s => {
            s.item = item;
            s.canUpdate = utils.isItemTouched((<any>s.buffer), item);
            s.canUpload = false;
          });
          app.popup.close();
        });
      }
    })
    .catch(error => {
      app.popup.close();
    });
  });

  subscribe('edit:update', () => {
    app.track('editor:update');
    var itemId = context.state.item._id;

    utils.tryToSave(context)
    .then(report => {
      return common.tryToUpload(itemId, {});
    })
    .then(isUploaded => {
      if (isUploaded) {
        return Item.find(context.state.item._id)
        .then(item => {
          context.update(s => {
            s.item = item;
            s.canUpdate = false;
            s.canUpload = false;
          });
          app.popup.close();
        });
      }
    })
    .catch(error => {
      app.popup.close();
      if (error.message.indexOf('conflict') > -1) {
        app.router.popContext();
      }
    });
  });

  subscribe('edit:select-template', (templateId: string) => {
    var insert = () => {
      var teamId = context.state.item.teamId;
      kobito.qiita.fetchExpandedTemplate(teamId, templateId).then(item => {
        context.state.buffer.tags = item.expanded_tags;
        var body = item.expanded_title + '\n' + item.expanded_body;
        context.getActiveComponent().refs.editor.codemirror.replaceSelection(body);
        context.getActiveComponent().refs.tagBuffer.codemirror.setValue(
          item.expanded_tags.map(i => i.name).join(' ')
        );
      });
    };

    app.track('editor:select-template');

    if (
      context.state.buffer.title.length === 0
      && context.state.buffer.body.length === 0
    ) {
      insert();
    } else {
      var teamId = context.state.item.teamId;
      Template.first(t => t.staticId === templateId && t.teamId === teamId)
      .then(template => {
        var message = __('Expanded contents will be inserted at the bottom and tags will be updated');
        app.popup.showWithChoices("\'" + template.name + '\n' + message, [
          {
            text: __('Confirm'),
            onSelect: () => {
              app.popup.close();
              insert();
            }
          },
          {
            text: __('Cancel'),
            onSelect: () => {
              app.popup.close();
            }
          }
        ]);
      });
    }

  });

  subscribe('markdown-editor:toggle-preview-mode', (templateId: string) => {
    context.update(s => { s.showPreview = !s.showPreview; })
    .then(() => {
      var comp: any = app.router.activeContext.getActiveComponent();
      comp.refs.editor.codemirror.refresh();
    });
    var config = kobito.storages.singletons.Config.getInstance();
    config.setLastShowPreview(context.state.showPreview);
  });
});

export = subscriber;
