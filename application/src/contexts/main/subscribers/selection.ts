declare var jQuery: any;
var _ = require('lodash');
import d = require('../main-defs');
import ui = require('../main-utils');

var subscriber = Arda.subscriber<d.Props, d.State>((context, subscribe) => {
  subscribe('main:select-item', (itemId: string) => {
    context.update(s => {
      s.selectedItemId = itemId;
      return s;
    }).catch(e => {
      // Handle db click from item list
      console.log('item opened');
    });
  });

  subscribe('main:select-next-item', () => {
    (<any>context).getActiveComponent().registerAutoFocus();

    var nextItem = kaita.queries.getNeiborItemOnTimeline(
      context.state.selectedTeamId,
      context.state.filterQuery,
      context.state.selectedItemId,
      +1
    );

    if (nextItem == null) {
      return;
    }

    context.update(state => {
      state.selectedItemId = nextItem._id;
    });
  });

  subscribe('main:select-first-item', () => {
    (<any>context).getActiveComponent().registerAutoFocus();
    var teamId = context.state.selectedTeamId;
    var query = context.state.filterQuery;
    kaita.queries.buildTimeline(teamId, query)
    .then(items => {
      if (items.length > 1) {
        context.update(state => {
          state.selectedItemId = items[0]._id;
          return state;
        });
      }
    });
  });

  subscribe('main:select-last-item', () => {
    (<any>context).getActiveComponent().registerAutoFocus();
    var teamId = context.state.selectedTeamId;
    var query = context.state.filterQuery;
    kaita.queries.buildTimeline(teamId, query)
    .then(items => {
      if (items.length > 1) {
        context.update(state => {
          state.selectedItemId = items[items.length - 1]._id;
          return state;
        });
      }
    });
  });

  subscribe('main:select-previous-item', () => {
    (<any>context).getActiveComponent().registerAutoFocus();

    var nextItem = kaita.queries.getNeiborItemOnTimeline(
      context.state.selectedTeamId,
      context.state.filterQuery,
      context.state.selectedItemId,
      -1
    );
    if (nextItem == null) {
      return;
    }

    context.update(state => {
      state.selectedItemId = nextItem._id;
    });

  });

  subscribe('main:select-next-team', () => {
    var teamId = context.state.selectedTeamId;
    Team.all().then(teams => {
      var index = _.findIndex(teams, team => team._id === teamId);
      var nextTeamId;
      if (teams[index + 1]) {
        nextTeamId = teams[index + 1]._id;
        jQuery('.contentHeader_teamSelect_select').val(teams[index + 1].name);
      } else {
        nextTeamId = teams[0]._id;
        jQuery('.contentHeader_teamSelect_select').val(teams[0].name);
      }
      context.update(s => {
        s.selectedTeamId = nextTeamId;
        s.selectedItemId = null;
        return s;
      });
      var config = kaita.storages.singletons.Config.getInstance();
      config.setLastTeamId(nextTeamId);
    });
  });

  subscribe('main:select-previous-team', () => {
    var teamId = context.state.selectedTeamId;
    Team.all().then(teams => {
      var index = _.findIndex(teams, team => team._id === teamId);

      var nextTeamId;
      if (teams[index - 1]) {
        nextTeamId = teams[index - 1]._id;
        context.update(s => {
          s.selectedTeamId = nextTeamId;
          s.selectedItemId = null;
          return s;
        });
        jQuery('.contentHeader_teamSelect_select').val(teams[index - 1].name);
      } else {
        nextTeamId = teams[teams.length - 1]._id;
        context.update(s => {
          s.selectedTeamId = nextTeamId;
          s.selectedItemId = null;
          return s;
        });
        jQuery('.contentHeader_teamSelect_select').val(teams[teams.length - 1].name);
      }

      context.update(s => {
        s.selectedTeamId = nextTeamId;
        s.selectedItemId = null;
        return s;
      });
      var config = kaita.storages.singletons.Config.getInstance();
      config.setLastTeamId(nextTeamId);
    });
  });

  subscribe('main:changeTeam', (teamId: string) => {
    app.track('change-team');
    var config = kaita.storages.singletons.Config.getInstance();

    // save last showed team to restore last state at boot
    config.setLastTeamId(teamId);

    // fetch usernames for completion
    kaita.qiita.fetchUsernames(teamId).then(usernames => {
      Username.save({_id: teamId, usernames});
      console.log('fetched usernames in team ' + teamId);
    }).catch((e) => {
      return;
    });

    context.update(s => {
      s.selectedTeamId = teamId;
      return s;
    });

    ui.syncItemsIfNotExistWithCover(teamId, context);
  });
});

export = subscriber;
