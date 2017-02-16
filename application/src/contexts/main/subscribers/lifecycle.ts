import d = require('../main-defs');
import ui = require('../main-utils');

var buildMenu = require('../../../utils/build-menu');

var subscriber = Arda.subscriber<d.Props, d.State>((context, subscribe) => {
  subscribe('context:started', () => {
    buildMenu('main');
  });

  subscribe('context:resumed', () => {
    if (context.state.filterQuery.length > 0) {
      var c = context.getActiveComponent();
      c.refs.queryInput.refs.oneline.codemirror.setValue(context.state.filterQuery);
    }
  });

  subscribe('context:created', () => {
    var targetTeamId = context.state.selectedTeamId;

    // fetch items
    kaita.queries.isLocalTeam(targetTeamId)
    .then(isLocalTeam => {
      if (!isLocalTeam && navigator.onLine) {
        ui.syncItemsIfNotExistWithCover(targetTeamId, context);
      }
    });

    // fetch usernames for completion
    if (navigator.onLine) {
      kaita.qiita.fetchUsernames(targetTeamId).then(usernames => {
        Username.save({_id: targetTeamId, usernames});
        console.log('fetched usernames in team ' + targetTeamId);
      }).catch((e) => {
        return;
      });
    }

    // start checking teams after 2000ms from boot
    setTimeout(() => {
      if (navigator.onLine) {
        ui.tryToUpdateTeamsAndTemplates(context);
      }
    }, 2000);
  });

  subscribe('context:resumed', () => {
    setTimeout(() => {
      (<any>context).getActiveComponent().registerAutoFocus();
      context.update();
    }, 16);
  });
});

export = subscriber;
