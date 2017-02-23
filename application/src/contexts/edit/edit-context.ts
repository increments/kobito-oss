import zoomSubscriber = require('../zoom-subscriber');

import subscriber = require('./edit-subscriber');
import d = require('./edit-defs');
import utils = require('./edit-utils');

class Edit extends Arda.Context<d.Props, d.State, d.Template> {
  get component() {return require('../../components/edit');}
  get subscribers() {return [subscriber, zoomSubscriber];}

  public initState(props: d.Props) {
    var config = kobito.storages.singletons.Config.getInstance();
    var showPreview = config.getLastShowPreview();
    if (showPreview == null) {
      showPreview = true;
    }

    return new Promise<d.State>(done => {
      Item.find(props.itemId)
      .then(item => {
        Team.find(item.teamId)
        .then(team => {
          kobito.queries.buildTags(item.teamId)
          .then(tags => {
            done({
              item: item,
              showPreview: showPreview,
              canUpdate: false,
              groups: null,
              canUpload: utils.isItemUploadable(item),
              isLocalTeam: team.local,
              teamName: team.name,
              buffer: {
                title: item.title,
                body: item.body,
                tags: item.tags,
                selectedGroup: item.group
              }
            });
          });
        });
      });
    });
  }

  public expandComponentProps(props, state) {
    return new Promise(done => {
      Template.select(t => t.teamId === state.item.teamId)
      .then(templates => {
        var ret: d.Template = _.cloneDeep(state);
        var tagCanditates = kobito.queries.getTags();

        ret.templates = templates.map(t => ({
          text: t.name,
          id: t.staticId,
          tagCanditates: tagCanditates,
          onSelect: function(event) {
            this.dispatch('edit:select-template', t.staticId);
            this.close();
          }
        }));
        done(ret);
      });
    });
  }

}

export = Edit;
